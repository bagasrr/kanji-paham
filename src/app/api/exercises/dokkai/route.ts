import { NextRequest, NextResponse } from 'next/server'
import { getDokkaiPassages } from '@/lib/exercises'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kind = searchParams.get('kind')
    const id = searchParams.get('id')

    const passages = await getDokkaiPassages()

    if (id) {
      const found = passages.find((p) => p.id === id)
      if (!found) {
        return NextResponse.json({ error: 'Passage not found' }, { status: 404 })
      }
      return NextResponse.json({ passage: found })
    }

    const filtered =
      kind && kind !== 'all'
        ? passages.filter((p) => p.kind === kind)
        : passages

    return NextResponse.json({ passages: filtered, total: passages.length })
  } catch (error) {
    console.error('[api/exercises/dokkai] Failed to load dokkai passages:', error)
    return NextResponse.json(
      { error: 'Failed to load dokkai passages' },
      { status: 500 }
    )
  }
}
