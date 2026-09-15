import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, level, subLevel, questions } = await request.json()

  if (!title || !level || !questions || !Array.isArray(questions)) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  try {
    const bank = await prisma.customQuestionBank.create({
      data: {
        title,
        level: parseInt(level),
        subLevel: subLevel ? parseInt(subLevel) : null,
        createdBy: session.user.id,
        questions: {
          create: questions.map(q => ({
            prompt: q.prompt,
            kanji: q.kanji || null,
            options: q.options,
            correctIndex: q.correctIndex,
            type: q.type || 'reading'
          }))
        }
      }
    })

    return NextResponse.json({ bank }, { status: 201 })
  } catch (error) {
    console.error('Save bank error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan bank soal' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const banks = await prisma.customQuestionBank.findMany({
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ banks })
}
