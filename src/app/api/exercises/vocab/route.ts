import { NextRequest, NextResponse } from 'next/server'
import { getVocabExamQuestions } from '@/lib/exercises'
import type { VocabExamQuestion } from '@/lib/types'
import { shuffle } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'all'
    const limitParam = parseInt(searchParams.get('limit') || '20', 10)
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 20

    const all = await getVocabExamQuestions()
    const counts = {
      all: all.length,
      para: all.filter((q) => q.mode === 'para').length,
      usage: all.filter((q) => q.mode === 'usage').length,
    }

    const pool: VocabExamQuestion[] =
      mode === 'para' || mode === 'usage'
        ? all.filter((q) => q.mode === mode)
        : all

    const questions = shuffle(pool).slice(0, limit)
    return NextResponse.json({ questions, counts })
  } catch (error) {
    console.error('[api/exercises/vocab] Failed to load vocab exam questions:', error)
    return NextResponse.json(
      { error: 'Failed to load vocab exam questions' },
      { status: 500 }
    )
  }
}
