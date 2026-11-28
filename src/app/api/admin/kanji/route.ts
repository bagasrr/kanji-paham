import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { kanjiToSvgFilename } from '@/lib/kanji'

export const dynamic = 'force-dynamic'

function isStaff(role?: string) {
  return role === 'ADMIN' || role === 'SENSEI'
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const levelParam = searchParams.get('level')
  const q = (searchParams.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = 24

  const jlpt = levelParam && levelParam !== 'all' ? parseInt(levelParam, 10) : undefined

  const where = {
    ...(jlpt && jlpt >= 1 && jlpt <= 5 ? { jlpt } : {}),
    ...(q
      ? {
          OR: [
            { character: { contains: q } },
            { keyword: { contains: q, mode: 'insensitive' as const } },
            { meanings: { has: q } },
            { meanings_id: { has: q } },
          ],
        }
      : {}),
  }

  const [kanjis, total] = await Promise.all([
    prisma.kanji.findMany({
      where,
      orderBy: [{ jlpt: 'desc' }, { subLevel: 'asc' }, { freq: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.kanji.count({ where }),
  ])

  return NextResponse.json({
    kanjis,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    character?: string
    strokes?: number
    jlpt?: number
    subLevel?: number
    meanings?: string[]
    meanings_id?: string[]
    readings_on?: string[]
    readings_kun?: string[]
    keyword?: string
    mnemonic?: string
  }

  const character = (body.character ?? '').trim()
  if (!character) {
    return NextResponse.json({ error: 'Karakter kanji wajib diisi' }, { status: 400 })
  }

  const exists = await prisma.kanji.findUnique({ where: { character } })
  if (exists) {
    return NextResponse.json({ error: 'Kanji sudah terdaftar di database' }, { status: 409 })
  }

  const created = await prisma.kanji.create({
    data: {
      character,
      strokes: Number(body.strokes) || 1,
      jlpt: Math.min(5, Math.max(1, Number(body.jlpt) || 5)),
      subLevel: Math.max(1, Number(body.subLevel) || 1),
      meanings: body.meanings ?? [],
      meanings_id: body.meanings_id ?? [],
      readings_on: body.readings_on ?? [],
      readings_kun: body.readings_kun ?? [],
      keyword: body.keyword?.trim() || null,
      mnemonic: body.mnemonic?.trim() || null,
      svgFile: kanjiToSvgFilename(character),
    },
  })

  return NextResponse.json({ kanji: created }, { status: 201 })
}
