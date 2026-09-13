import Link from 'next/link'
import { getKanjiBySubLevel } from '@/lib/kanji'
import { ArrowLeft } from 'lucide-react'
import { getSubLevelTitle } from '@/lib/categories'
import { KanjiMeaning } from '@/components/KanjiMeaning'

export default async function SubLevelPage({
  params,
}: {
  params: Promise<{ level: string; subLevel: string }>
}) {
  const { level, subLevel } = await params
  const levelNum = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5
  const subLevelNum = parseInt(subLevel, 10)

  const kanjis = await getKanjiBySubLevel(levelNum, subLevelNum)

  return (
    <div className="px-4 py-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background pb-3">
        <Link
          href={`/learn/${level}`}
          className="flex items-center gap-2 text-sm text-text-muted mb-3 hover:text-primary"
        >
          <ArrowLeft size={16} /> N{level}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-main">
              {getSubLevelTitle(levelNum, subLevelNum)}
            </h1>
            <p className="text-sm text-text-muted">{kanjis.length} kanji</p>
          </div>
        </div>
        {/* Progress bar placeholder */}
        <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
          <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Kanji grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {kanjis.map((entry) => (
          <Link
            key={entry.character}
            href={`/learn/${level}/${subLevel}/${encodeURIComponent(entry.character)}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border-color bg-surface hover:shadow-md hover:border-primary transition-all"
          >
            <span
              className="text-5xl font-serif text-text-main"
              style={{ fontFamily: 'serif' }}
            >
              {entry.character}
            </span>
            <p className="text-xs text-text-muted text-center truncate w-full">
              <KanjiMeaning meanings={entry.meanings} meanings_id={entry.meanings_id} />
            </p>
          </Link>
        ))}
      </div>

      {/* Floating Action Button for Quiz */}
      <Link
        href={`/learn/${level}/${subLevel}/quiz`}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-105 transition-all z-40"
        title="Mulai Quiz"
      >
        <span className="font-bold text-sm">QUIZ</span>
      </Link>
    </div>
  )
}
