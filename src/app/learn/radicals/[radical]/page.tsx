import { notFound } from 'next/navigation'
import { getKanjiCircleByRadical } from '@/lib/radicals'
import { RadicalKanjiGrid } from '@/components/RadicalKanjiGrid'

export const dynamic = 'force-dynamic'

export default async function RadicalDetailPage({
  params,
}: {
  params: Promise<{ radical: string }>
}) {
  const { radical: rawRadical } = await params
  const decoded = decodeURIComponent(rawRadical)

  const { radical, kanjis } = await getKanjiCircleByRadical(decoded)
  if (!radical) notFound()

  return <RadicalKanjiGrid radical={radical} kanjis={kanjis} />
}
