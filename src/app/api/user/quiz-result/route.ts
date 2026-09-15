import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { level, subLevel, mode, score, total, mistakes } = await request.json()

  if (!level || !subLevel || score === undefined || !total) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // 1. Save Quiz Result
  const quizResult = await prisma.quizResult.create({
    data: {
      userId: session.user.id,
      level,
      subLevel,
      mode,
      score,
      total,
    }
  })

  // 2. Track Weak Kanjis based on mistakes
  if (mistakes && Array.isArray(mistakes)) {
    for (const char of mistakes) {
      await prisma.weakKanji.upsert({
        where: { userId_character: { userId: session.user.id, character: char } },
        update: { 
          mistakeCount: { increment: 1 },
          lastMistake: new Date()
        },
        create: {
          userId: session.user.id,
          character: char,
          mistakeCount: 1
        }
      })
    }
  }

  return Response.json({ quizResult }, { status: 201 })
}
