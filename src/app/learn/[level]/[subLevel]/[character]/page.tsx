import { notFound } from 'next/navigation'
import { getKanjiBySubLevel } from '@/lib/kanji'
import { KanjiCard } from '@/components/KanjiCard'
import { KanjiNavigation } from '@/components/KanjiNavigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSubLevelTitle } from '@/lib/categories'

export default async function KanjiDetailPage({
  params,
}: {
  params: Promise<{ level: string; subLevel: string; character: string }>
}) {
  const { level, subLevel, character } = await params
  const levelNum = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5
  const subLevelNum = parseInt(subLevel, 10)
  const decoded = decodeURIComponent(character)

  // Get kanji within the same subLevel to enable left/right navigation
  const allInSubLevel = await getKanjiBySubLevel(levelNum, subLevelNum)
  const index = allInSubLevel.findIndex((k) => k.character === decoded)
  
  if (index === -1) notFound()
  const entry = allInSubLevel[index]

  const prevKanji = index > 0 ? allInSubLevel[index - 1].character : null
  const nextKanji = index < allInSubLevel.length - 1 ? allInSubLevel[index + 1].character : null

  const baseUrl = `/learn/${level}/${subLevel}`

  return (
    <div className="px-4 py-6">
      <Link
        href={baseUrl}
        className="flex items-center gap-2 text-sm text-text-muted mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke {getSubLevelTitle(levelNum, subLevelNum)}
      </Link>
      
      <KanjiCard entry={entry} />

      <KanjiNavigation 
        prevUrl={prevKanji ? `${baseUrl}/${encodeURIComponent(prevKanji)}` : undefined}
        nextUrl={nextKanji ? `${baseUrl}/${encodeURIComponent(nextKanji)}` : undefined}
      />
    </div>
  )
}
