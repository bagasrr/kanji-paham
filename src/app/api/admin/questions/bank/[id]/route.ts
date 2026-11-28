import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  const bank = await prisma.customQuestionBank.findUnique({
    where: { id },
    include: { questions: { orderBy: { id: 'asc' } } },
  })

  if (!bank) {
    return NextResponse.json({ error: 'Bank soal tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json({ bank })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  const body = (await request.json()) as {
    title?: string
    level?: number
    subLevel?: number | null
  }

  const bank = await prisma.customQuestionBank.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.level !== undefined ? { level: Number(body.level) } : {}),
      ...(body.subLevel !== undefined ? { subLevel: body.subLevel ? Number(body.subLevel) : null } : {}),
    },
  })

  return NextResponse.json({ bank })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireStaff()
  if (error || !session) return error!

  const { id } = await params

  try {
    const bank = await prisma.customQuestionBank.findUnique({ where: { id } })
    if (!bank) {
      return NextResponse.json({ error: 'Bank soal tidak ditemukan' }, { status: 404 })
    }

    if (bank.createdBy !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.customQuestionBank.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete bank error:', err)
    return NextResponse.json({ error: 'Gagal menghapus bank soal' }, { status: 500 })
  }
}
