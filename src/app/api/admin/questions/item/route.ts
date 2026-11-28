import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const body = (await request.json()) as {
    bankId?: string
    kanji?: string | null
    prompt?: string
    options?: string[]
    correctIndex?: number
    type?: string
    audioUrl?: string | null
  }

  if (!body.bankId || !body.prompt?.trim() || !Array.isArray(body.options) || body.options.length < 2) {
    return NextResponse.json({ error: 'Data soal tidak lengkap' }, { status: 400 })
  }

  const question = await prisma.customQuestion.create({
    data: {
      bankId: body.bankId,
      kanji: body.kanji?.trim() || null,
      prompt: body.prompt.trim(),
      options: body.options,
      correctIndex: Number(body.correctIndex) || 0,
      type: body.type?.trim() || 'reading',
      audioUrl: body.audioUrl?.trim() || null,
    },
  })

  return NextResponse.json({ question }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const body = (await request.json()) as {
    id?: string
    kanji?: string | null
    prompt?: string
    options?: string[]
    correctIndex?: number
    type?: string
    audioUrl?: string | null
  }

  if (!body.id) {
    return NextResponse.json({ error: 'ID soal wajib diisi' }, { status: 400 })
  }

  const question = await prisma.customQuestion.update({
    where: { id: body.id },
    data: {
      ...(body.kanji !== undefined ? { kanji: body.kanji?.trim() || null } : {}),
      ...(body.prompt !== undefined ? { prompt: body.prompt.trim() } : {}),
      ...(body.options !== undefined ? { options: body.options } : {}),
      ...(body.correctIndex !== undefined ? { correctIndex: Number(body.correctIndex) } : {}),
      ...(body.type !== undefined ? { type: body.type.trim() } : {}),
      ...(body.audioUrl !== undefined ? { audioUrl: body.audioUrl?.trim() || null } : {}),
    },
  })

  return NextResponse.json({ question })
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID soal wajib diisi' }, { status: 400 })
  }

  await prisma.customQuestion.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
