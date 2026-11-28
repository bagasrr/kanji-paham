import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface QuestionInput {
  orderIdx: number
  prompt: string
  options: string[]
  optsEn?: string[]
  answer: number
  why?: string | null
  wrong?: Prisma.InputJsonValue | null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  const decoded = decodeURIComponent(id)

  const body = (await request.json()) as {
    kind?: string
    title?: string
    text?: string
    en?: string
    audioUrl?: string | null
    questions?: QuestionInput[]
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.dokkaiPassage.update({
      where: { id: decoded },
      data: {
        ...(body.kind !== undefined ? { kind: body.kind.trim() } : {}),
        ...(body.title !== undefined ? { title: body.title.trim() } : {}),
        ...(body.text !== undefined ? { text: body.text.trim() } : {}),
        ...(body.en !== undefined ? { en: body.en.trim() } : {}),
        ...(body.audioUrl !== undefined ? { audioUrl: body.audioUrl?.trim() || null } : {}),
      },
    })

    if (body.questions !== undefined) {
      await tx.dokkaiQuestion.deleteMany({ where: { passageId: decoded } })
      if (body.questions.length > 0) {
        await tx.dokkaiQuestion.createMany({
          data: body.questions.map((q, idx) => ({
            passageId: decoded,
            orderIdx: q.orderIdx ?? idx,
            prompt: q.prompt.trim(),
            options: q.options,
            optsEn: q.optsEn ?? [],
            answer: Number(q.answer) || 0,
            why: q.why?.trim() || null,
            wrong: q.wrong ?? Prisma.DbNull,
          })),
        })
      }
    }

    return tx.dokkaiPassage.findUnique({
      where: { id: decoded },
      include: { questions: { orderBy: { orderIdx: 'asc' } } },
    })
  })

  return NextResponse.json({ passage: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff()
  if (error) return error

  const { id } = await params
  await prisma.dokkaiPassage.delete({ where: { id: decodeURIComponent(id) } })
  return NextResponse.json({ success: true })
}
