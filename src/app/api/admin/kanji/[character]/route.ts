import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function isStaff(role?: string) {
  return role === 'ADMIN' || role === 'SENSEI'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ character: string }> }
) {
  const session = await auth()
  if (!session?.user?.id || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { character } = await params
  const decoded = decodeURIComponent(character)

  const body = (await request.json()) as {
    strokes?: number
    jlpt?: number
    subLevel?: number
    meanings?: string[]
    meanings_id?: string[]
    readings_on?: string[]
    readings_kun?: string[]
    keyword?: string | null
    mnemonic?: string | null
  }

  const updated = await prisma.kanji.update({
    where: { character: decoded },
    data: {
      ...(body.strokes !== undefined ? { strokes: Number(body.strokes) } : {}),
      ...(body.jlpt !== undefined ? { jlpt: Number(body.jlpt) } : {}),
      ...(body.subLevel !== undefined ? { subLevel: Number(body.subLevel) } : {}),
      ...(body.meanings !== undefined ? { meanings: body.meanings } : {}),
      ...(body.meanings_id !== undefined ? { meanings_id: body.meanings_id } : {}),
      ...(body.readings_on !== undefined ? { readings_on: body.readings_on } : {}),
      ...(body.readings_kun !== undefined ? { readings_kun: body.readings_kun } : {}),
      ...(body.keyword !== undefined ? { keyword: body.keyword || null } : {}),
      ...(body.mnemonic !== undefined ? { mnemonic: body.mnemonic || null } : {}),
    },
  })

  return NextResponse.json({ kanji: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ character: string }> }
) {
  const session = await auth()
  if (!session?.user?.id || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { character } = await params
  const decoded = decodeURIComponent(character)

  await prisma.kanji.delete({ where: { character: decoded } })
  return NextResponse.json({ success: true })
}
