import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  const body = (await request.json()) as {
    targetWord?: string
    mode?: string
    prompt?: string
    options?: string[]
    optsEn?: string[]
    answer?: number
    why?: string | null
    en?: string | null
    audioUrl?: string | null
    wrong?: Prisma.InputJsonValue | null
  }

  const updated = await prisma.vocabExamQuestion.update({
    where: { id },
    data: {
      ...(body.targetWord !== undefined ? { targetWord: body.targetWord.trim() } : {}),
      ...(body.mode !== undefined ? { mode: body.mode === 'usage' ? 'usage' : 'para' } : {}),
      ...(body.prompt !== undefined ? { prompt: body.prompt.trim() } : {}),
      ...(body.options !== undefined ? { options: body.options } : {}),
      ...(body.optsEn !== undefined ? { optsEn: body.optsEn } : {}),
      ...(body.answer !== undefined ? { answer: Number(body.answer) } : {}),
      ...(body.why !== undefined ? { why: body.why?.trim() || null } : {}),
      ...(body.en !== undefined ? { en: body.en?.trim() || null } : {}),
      ...(body.audioUrl !== undefined ? { audioUrl: body.audioUrl?.trim() || null } : {}),
      ...(body.wrong !== undefined
        ? { wrong: body.wrong === null ? Prisma.DbNull : body.wrong }
        : {}),
    },
  })

  return NextResponse.json({ question: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  await prisma.vocabExamQuestion.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
