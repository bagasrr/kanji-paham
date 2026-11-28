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

export async function GET(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const kind = (searchParams.get('kind') ?? 'all').trim()
  const q = (searchParams.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = 20

  const where = {
    ...(kind !== 'all' ? { kind } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: 'insensitive' as const } },
            { title: { contains: q, mode: 'insensitive' as const } },
            { text: { contains: q } },
          ],
        }
      : {}),
  }

  const [passages, total] = await Promise.all([
    prisma.dokkaiPassage.findMany({
      where,
      include: { questions: { orderBy: { orderIdx: 'asc' } } },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dokkaiPassage.count({ where }),
  ])

  return NextResponse.json({
    passages,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
}

export async function POST(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const body = (await request.json()) as {
    id?: string
    kind?: string
    title?: string
    text?: string
    en?: string
    audioUrl?: string | null
    questions?: QuestionInput[]
  }

  const id = (body.id ?? '').trim()
  const title = (body.title ?? '').trim()
  const text = (body.text ?? '').trim()
  if (!id || !title || !text) {
    return NextResponse.json({ error: 'ID, judul, dan teks bacaan wajib diisi' }, { status: 400 })
  }

  const exists = await prisma.dokkaiPassage.findUnique({ where: { id } })
  if (exists) {
    return NextResponse.json({ error: 'ID bacaan sudah ada' }, { status: 409 })
  }

  const passage = await prisma.dokkaiPassage.create({
    data: {
      id,
      kind: (body.kind ?? 'short').trim() || 'short',
      title,
      text,
      en: (body.en ?? '').trim(),
      audioUrl: body.audioUrl?.trim() || null,
      questions: {
        create: (body.questions ?? []).map((q, idx) => ({
          orderIdx: q.orderIdx ?? idx,
          prompt: q.prompt.trim(),
          options: q.options,
          optsEn: q.optsEn ?? [],
          answer: Number(q.answer) || 0,
          why: q.why?.trim() || null,
          wrong: q.wrong ?? Prisma.DbNull,
        })),
      },
    },
    include: { questions: { orderBy: { orderIdx: 'asc' } } },
  })

  return NextResponse.json({ passage }, { status: 201 })
}
