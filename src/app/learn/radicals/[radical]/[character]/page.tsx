import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getKanjiCircleByRadical } from '@/lib/radicals'
import { KanjiCard } from '@/components/KanjiCard'
import { KanjiNavigation } from '@/components/KanjiNavigation'

export const dynamic = 'force-dynamic'

export default async function RadicalKanjiDetailPage({
  params,
}: {
  params: Promise<{ radical: string; character: string }>
}) {
  const { radical: rawRadical, character: rawChar } = await params
  const decodedRadical = decodeURIComponent(rawRadical)
  const decodedChar = decodeURIComponent(rawChar)

  const { radical, kanjis } = await getKanjiCircleByRadical(decodedRadical)
  if (!radical) notFound()

  const index = kanjis.findIndex((k) => k.character === decodedChar)
  if (index === -1) notFound()

  const entry = kanjis[index]
  const prevKanji = index > 0 ? kanjis[index - 1].character : null
  const nextKanji = index < kanjis.length - 1 ? kanjis[index + 1].character : null

  const baseUrl = `/learn/radicals/${encodeURIComponent(decodedRadical)}`

  return (
    <div className="py-4 pb-24">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-6">
        <Link
          href={baseUrl}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-medium bg-surface px-4 py-2 rounded-full border border-border-color shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>
            Kembali ke Radikal <strong className="text-primary">{decodedRadical}</strong>
          </span>
        </Link>

        <span className="px-3.5 py-1.5 rounded-full bg-surface border border-border-color text-xs font-bold text-text-muted shadow-sm">
          {index + 1} / {kanjis.length} di radikal {decodedRadical}
        </span>
      </div>

      <KanjiCard entry={entry} />

      <KanjiNavigation
        prevUrl={prevKanji ? `${baseUrl}/${encodeURIComponent(prevKanji)}` : undefined}
        nextUrl={nextKanji ? `${baseUrl}/${encodeURIComponent(nextKanji)}` : undefined}
      />
    </div>
  )
}
