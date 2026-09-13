import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: 'desc' },
  })
  return Response.json({ progress })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { character, jlptLevel, subLevel } = await request.json()

  const progress = await prisma.userProgress.upsert({
    where: { userId_character: { userId: session.user.id, character } },
    update: { completedAt: new Date() },
    create: { userId: session.user.id, character, jlptLevel, subLevel },
  })
  return Response.json({ progress }, { status: 201 })
}
