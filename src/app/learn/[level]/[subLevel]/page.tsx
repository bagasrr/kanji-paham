import Link from 'next/link'
import { getKanjiBySubLevel } from '@/lib/kanji'
import { ArrowLeft, Brain } from 'lucide-react'
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
    <div className="py-2 pb-24 relative min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md pt-4 pb-4 border-b border-border-color mb-8 -mx-4 px-4 md:mx-0 md:px-0">
        <Link
          href={`/learn/${level}`}
          className="inline-flex items-center gap-2 text-sm text-text-muted mb-4 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Kembali ke N{level}
        </Link>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-main">
              {getSubLevelTitle(levelNum, subLevelNum)}
            </h1>
            <span className="px-3 py-1 rounded-full bg-card-muted text-xs font-bold text-text-muted">
              {kanjis.length} Kanji
            </span>
          </div>
          {/* Progress bar placeholder */}
          <div className="w-full h-2 bg-card-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      {/* Kanji grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {kanjis.map((entry) => (
          <Link
            key={entry.character}
            href={`/learn/${level}/${subLevel}/${encodeURIComponent(entry.character)}`}
            className="group flex flex-col items-center gap-3 p-6 rounded-3xl border border-border-color bg-surface hover:shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary transition-all duration-500"></div>
            <span
              className="text-6xl md:text-7xl text-text-main group-hover:text-primary transition-colors"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              {entry.character}
            </span>
            <p className="text-sm font-medium text-text-muted text-center truncate w-full mt-2">
              <KanjiMeaning meanings={entry.meanings} meanings_id={entry.meanings_id} />
            </p>
          </Link>
        ))}
      </div>

      {/* Floating Action Button for Quiz */}
      <Link
        href={`/learn/${level}/${subLevel}/quiz`}
        className="fixed bottom-24 md:bottom-10 right-4 md:right-10 px-6 py-4 bg-primary text-white rounded-full flex items-center justify-center gap-3 shadow-lg hover:bg-primary-hover hover:scale-105 hover:shadow-xl transition-all z-40 group border-2 border-white/20"
      >
        <Brain size={24} className="group-hover:animate-bounce" />
        <span className="font-bold tracking-wide">Mulai Quiz</span>
      </Link>
    </div>
  )
}
