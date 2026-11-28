'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { KanjiEntry, RadicalEntry } from '@/lib/types'
import { useLanguage } from '@/components/LanguageProvider'
import { KanjiMeaning } from '@/components/KanjiMeaning'

const LEVEL_BADGE_COLORS: Record<number, string> = {
  5: 'bg-success/15 text-success border-success/25',
  4: 'bg-secondary/15 text-secondary border-secondary/25',
  3: 'bg-warning/15 text-warning border-warning/25',
  2: 'bg-sakura/15 text-sakura border-sakura/25',
  1: 'bg-primary/15 text-primary border-primary/25',
}

interface Props {
  radical: RadicalEntry
  kanjis: KanjiEntry[]
}

export function RadicalKanjiGrid({ radical, kanjis }: Props) {
  const { lang } = useLanguage()
  const isId = lang === 'id'
  const [levelFilter, setLevelFilter] = useState<number | null>(null)

  const levelCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const k of kanjis) {
      counts[k.jlpt] = (counts[k.jlpt] ?? 0) + 1
    }
    return counts
  }, [kanjis])

  const filtered = useMemo(
    () => (levelFilter === null ? kanjis : kanjis.filter((k) => k.jlpt === levelFilter)),
    [kanjis, levelFilter]
  )

  return (
    <div className="py-2 pb-28">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md pt-3 pb-4 border-b border-border-color mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <Link
          href="/learn/radicals"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-3 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          {isId ? 'Kembali ke Daftar Radikal' : 'Back to Radicals'}
        </Link>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl bg-surface border-2 border-primary/30 flex items-center justify-center text-4xl text-primary font-bold shadow-sm flex-shrink-0 font-jp"
            >
              {radical.radical}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-text-main capitalize">
                  {radical.meanings.length > 0
                    ? radical.meanings.join(', ')
                    : `${isId ? 'Radikal' : 'Radical'} ${radical.radical}`}
                </h1>
                {radical.classicalNumber && (
                  <span className="px-2 py-0.5 rounded-full bg-card-muted text-[11px] font-bold text-text-muted">
                    #{radical.classicalNumber}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                {radical.strokeCount} {isId ? 'coretan' : 'strokes'} · {kanjis.length}{' '}
                {isId ? 'kanji N5–N1 dalam kelompok ini' : 'N5–N1 kanji in this circle'}
              </p>
            </div>
          </div>
        </div>

        {/* JLPT Level Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
          <button
            onClick={() => setLevelFilter(null)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              levelFilter === null
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border-color text-text-muted hover:text-text-main'
            }`}
          >
            {isId ? `Semua (${kanjis.length})` : `All (${kanjis.length})`}
          </button>
          {[5, 4, 3, 2, 1].map((lvl) =>
            levelCounts[lvl] > 0 ? (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border-color text-text-muted hover:text-text-main'
                }`}
              >
                N{lvl} ({levelCounts[lvl]})
              </button>
            ) : null
          )}
        </div>
      </div>

      {/* Kanji Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filtered.map((entry) => {
          const badgeStyle =
            LEVEL_BADGE_COLORS[entry.jlpt] ?? 'bg-card-muted text-text-muted border-border-color'
          return (
            <Link
              key={entry.character}
              href={`/learn/radicals/${encodeURIComponent(radical.radical)}/${encodeURIComponent(entry.character)}`}
              className="group flex flex-col items-center gap-2.5 p-5 rounded-3xl border border-border-color bg-surface hover:shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
            >
              <div className="w-full flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
                  N{entry.jlpt}
                </span>
                <span className="text-[11px] text-text-subtle font-medium">
                  {entry.strokes} str
                </span>
              </div>

              <span
                className="text-6xl text-text-main group-hover:text-primary transition-colors py-1 font-jp"
              >
                {entry.character}
              </span>

              <p className="text-xs sm:text-sm font-medium text-text-muted text-center truncate w-full capitalize">
                <KanjiMeaning meanings={entry.meanings} meanings_id={entry.meanings_id} />
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
