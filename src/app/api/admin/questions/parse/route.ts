import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import * as mammoth from 'mammoth'
const pdfParse = require('pdf-parse')

// Next.js App Router defaults to Node.js runtime for API routes

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let extractedText = ''

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const data = await pdfParse(buffer)
      extractedText = data.text
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      return NextResponse.json({ error: 'Format file tidak didukung. Gunakan PDF atau Word (.docx)' }, { status: 400 })
    }

    // Basic Regex Parsing Strategy:
    // Format expected in document:
    // Q: Apa arti dari kanji ini?
    // Kanji: 日 (optional)
    // A: Matahari
    // B: Bulan
    // C: Bintang
    // D: Awan
    // Ans: A
    // Type: meaning (optional, default reading)
    
    const rawQuestions = extractedText.split(/(?:^|\n)\s*Q\s*:/i).filter(q => q.trim().length > 0)
    
    const parsedQuestions = rawQuestions.map(raw => {
      const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      
      const prompt = lines[0]
      let kanji = null
      let options: string[] = []
      let correctIndex = 0
      let type = 'reading'

      for (const line of lines.slice(1)) {
        if (line.match(/^Kanji\s*:/i)) {
          kanji = line.replace(/^Kanji\s*:/i, '').trim()
        } else if (line.match(/^A\s*[\.\:\)]/i)) {
          options[0] = line.replace(/^A\s*[\.\:\)]/i, '').trim()
        } else if (line.match(/^B\s*[\.\:\)]/i)) {
          options[1] = line.replace(/^B\s*[\.\:\)]/i, '').trim()
        } else if (line.match(/^C\s*[\.\:\)]/i)) {
          options[2] = line.replace(/^C\s*[\.\:\)]/i, '').trim()
        } else if (line.match(/^D\s*[\.\:\)]/i)) {
          options[3] = line.replace(/^D\s*[\.\:\)]/i, '').trim()
        } else if (line.match(/^Ans(wer)?\s*:/i)) {
          const ansChar = line.replace(/^Ans(wer)?\s*:/i, '').trim().toUpperCase()
          correctIndex = ansChar === 'B' ? 1 : ansChar === 'C' ? 2 : ansChar === 'D' ? 3 : 0
        } else if (line.match(/^Type\s*:/i)) {
          type = line.replace(/^Type\s*:/i, '').trim().toLowerCase()
        }
      }

      // If options are missing (malformed), fallback to empty to avoid crashing
      options = options.filter(Boolean)
      
      return {
        prompt,
        kanji,
        options,
        correctIndex,
        type
      }
    }).filter(q => q.options.length >= 2) // Valid questions must have at least 2 options

    if (parsedQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'Tidak dapat menemukan soal dalam dokumen. Pastikan format penulisan sudah benar (Q:, A:, B:, C:, D:, Ans:).' 
      }, { status: 400 })
    }

    return NextResponse.json({ questions: parsedQuestions })

  } catch (error) {
    console.error('File parsing error:', error)
    return NextResponse.json({ error: 'Gagal memproses file' }, { status: 500 })
  }
}
