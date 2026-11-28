import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const applications = await prisma.teacherApplication.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ applications })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json()) as {
    id?: string
    status?: 'APPROVED' | 'REJECTED'
  }

  if (!body.id || (body.status !== 'APPROVED' && body.status !== 'REJECTED')) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const app = await prisma.teacherApplication.update({
    where: { id: body.id },
    data: { status: body.status },
  })

  if (body.status === 'APPROVED') {
    await prisma.user.update({
      where: { id: app.userId },
      data: { role: 'SENSEI' },
    })
  }

  return NextResponse.json({ application: app })
}
