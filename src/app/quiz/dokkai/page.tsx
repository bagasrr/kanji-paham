import { getDokkaiPassages } from '@/lib/exercises'
import { getAllKanjiReferenceMap } from '@/lib/kanji'
import { DokkaiPractice } from '@/components/DokkaiPractice'

export const dynamic = 'force-dynamic'

export default async function DokkaiPage() {
  const [passages, kanjiMap] = await Promise.all([
    getDokkaiPassages(),
    getAllKanjiReferenceMap(),
  ])
  return <DokkaiPractice passages={passages} kanjiMap={kanjiMap} />
}
