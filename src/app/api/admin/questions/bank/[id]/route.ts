import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const bank = await prisma.customQuestionBank.findUnique({ where: { id } })
    if (!bank) {
      return NextResponse.json({ error: 'Bank soal tidak ditemukan' }, { status: 404 })
    }

    // Optional: Only allow creator or ADMIN to delete
    if (bank.createdBy !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.customQuestionBank.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete bank error:', error)
    return NextResponse.json({ error: 'Gagal menghapus bank soal' }, { status: 500 })
  }
}
