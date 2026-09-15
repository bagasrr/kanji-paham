import { NextRequest } from 'next/server'
import { getKanjiBySubLevel } from '@/lib/kanji'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const level = parseInt(searchParams.get('level') ?? '5', 10) as 1 | 2 | 3 | 4 | 5
  const subLevel = parseInt(searchParams.get('subLevel') ?? '1', 10)

  try {
    const kanji = await getKanjiBySubLevel(level, subLevel)
    return Response.json({ kanji })
  } catch {
    return Response.json({ error: 'Data not found' }, { status: 404 })
  }
}
