import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface VocabPayload {
  id?: string
  word?: string
  reading?: string
  meanings?: string[]
  meanings_id?: string[]
  mnemonic?: string | null
  audioUrl?: string | null
  examples?: Prisma.InputJsonValue | null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ character: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { character } = await params
  const kanjiChar = decodeURIComponent(character)
  const body = (await request.json()) as VocabPayload

  const word = (body.word ?? '').trim()
  const reading = (body.reading ?? '').trim()
  if (!word || !reading) {
    return NextResponse.json({ error: 'Kata dan bacaan wajib diisi' }, { status: 400 })
  }

  const vocab = await prisma.vocab.create({
    data: {
      kanjiChar,
      word,
      reading,
      meanings: body.meanings ?? [],
      meanings_id: body.meanings_id ?? [],
      mnemonic: body.mnemonic?.trim() || null,
      audioUrl: body.audioUrl?.trim() || null,
      examples: body.examples ?? Prisma.DbNull,
    },
  })

  return NextResponse.json({ vocab }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const body = (await request.json()) as VocabPayload
  if (!body.id) {
    return NextResponse.json({ error: 'ID kosakata wajib diisi' }, { status: 400 })
  }

  const updated = await prisma.vocab.update({
    where: { id: body.id },
    data: {
      ...(body.word !== undefined ? { word: body.word.trim() } : {}),
      ...(body.reading !== undefined ? { reading: body.reading.trim() } : {}),
      ...(body.meanings !== undefined ? { meanings: body.meanings } : {}),
      ...(body.meanings_id !== undefined ? { meanings_id: body.meanings_id } : {}),
      ...(body.mnemonic !== undefined ? { mnemonic: body.mnemonic?.trim() || null } : {}),
      ...(body.audioUrl !== undefined ? { audioUrl: body.audioUrl?.trim() || null } : {}),
      ...(body.examples !== undefined
        ? { examples: body.examples === null ? Prisma.DbNull : body.examples }
        : {}),
    },
  })

  return NextResponse.json({ vocab: updated })
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID kosakata wajib diisi' }, { status: 400 })
  }

  await prisma.vocab.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
