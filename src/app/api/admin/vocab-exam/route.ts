import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireStaff } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const mode = (searchParams.get('mode') ?? 'all').trim()
  const q = (searchParams.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = 24

  const where = {
    ...(mode !== 'all' ? { mode } : {}),
    ...(q
      ? {
          OR: [
            { targetWord: { contains: q } },
            { prompt: { contains: q } },
            { en: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [questions, total] = await Promise.all([
    prisma.vocabExamQuestion.findMany({
      where,
      orderBy: [{ targetWord: 'asc' }, { mode: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.vocabExamQuestion.count({ where }),
  ])

  return NextResponse.json({
    questions,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
}

export async function POST(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

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

  const targetWord = (body.targetWord ?? '').trim()
  const mode = body.mode === 'usage' ? 'usage' : 'para'
  const prompt = (body.prompt ?? '').trim()
  if (!targetWord || !prompt || !Array.isArray(body.options) || body.options.length < 2) {
    return NextResponse.json({ error: 'Kata target, soal, dan minimal 2 opsi wajib diisi' }, { status: 400 })
  }

  const created = await prisma.vocabExamQuestion.create({
    data: {
      targetWord,
      mode,
      prompt,
      options: body.options,
      optsEn: body.optsEn ?? [],
      answer: Number(body.answer) || 0,
      why: body.why?.trim() || null,
      en: body.en?.trim() || null,
      audioUrl: body.audioUrl?.trim() || null,
      wrong: body.wrong ?? Prisma.DbNull,
    },
  })

  return NextResponse.json({ question: created }, { status: 201 })
}
