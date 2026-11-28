'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Layers, Search } from 'lucide-react'
import type { RadicalEntry } from '@/lib/types'
import { useLanguage } from '@/components/LanguageProvider'

interface Props {
  radicals: RadicalEntry[]
}

export function RadicalsBrowser({ radicals }: Props) {
  const { lang } = useLanguage()
  const isId = lang === 'id'

  const [query, setQuery] = useState('')
  const [strokeFilter, setStrokeFilter] = useState<number | null>(null)

  const strokeCounts = useMemo(
    () => [...new Set(radicals.map((r) => r.strokeCount))].sort((a, b) => a - b),
    [radicals]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return radicals.filter((r) => {
      if (strokeFilter !== null && r.strokeCount !== strokeFilter) return false
      if (!q) return true
      return (
        r.radical.includes(q) ||
        r.meanings.some((m) => m.toLowerCase().includes(q)) ||
        String(r.classicalNumber ?? '') === q
      )
    })
  }, [radicals, strokeFilter, query])

  return (
    <div className="py-2 pb-28 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-primary font-semibold bg-surface px-3.5 py-2 rounded-full border border-border-color shadow-sm mb-4"
        >
          <ArrowLeft size={16} />
          {isId ? 'Kembali ke Level Kanji' : 'Back to Kanji Levels'}
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
              {isId ? 'Radikal Kanji (部首)' : 'Kanji Radicals (部首)'}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {isId
                ? `${radicals.length} radikal penyusun · Pilih radikal untuk melihat kelompok kanji N5–N1`
                : `${radicals.length} radicals · Pick a radical to browse its N5–N1 kanji group`}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isId
              ? 'Cari radikal (cth: 木, water, heart)...'
              : 'Search radical or meaning (e.g. 木, water, heart)...'
          }
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border-color bg-surface text-sm text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary"
        />
      </div>

      {/* Stroke Count Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
        <button
          onClick={() => setStrokeFilter(null)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
            strokeFilter === null
              ? 'bg-primary text-white border-primary'
              : 'bg-surface border-border-color text-text-muted hover:text-text-main'
          }`}
        >
          {isId ? `Semua (${radicals.length})` : `All (${radicals.length})`}
        </button>
        {strokeCounts.map((s) => (
          <button
            key={s}
            onClick={() => setStrokeFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              strokeFilter === s
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border-color text-text-muted hover:text-text-main'
            }`}
          >
            {s} {isId ? 'coretan' : 'strokes'}
          </button>
        ))}
      </div>

      {/* Radicals Grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-dashed border-border-color p-8 text-center text-sm text-text-muted">
          {isId ? 'Tidak ada radikal yang cocok.' : 'No matching radicals found.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((r) => (
            <Link
              key={r.radical}
              href={`/learn/radicals/${encodeURIComponent(r.radical)}`}
              className="group bg-surface rounded-2xl border border-border-color hover:border-primary hover:shadow-md p-4 transition-all flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md bg-card-muted text-[10px] font-bold text-text-muted">
                  {r.strokeCount} {isId ? 'str' : 'str'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  {r.kanjiChars.length} {isId ? 'kanji' : 'kanji'}
                </span>
              </div>

              <div className="text-center py-1">
                <span
                  className="text-5xl text-text-main group-hover:text-primary transition-colors block leading-none font-jp"
                >
                  {r.radical}
                </span>
              </div>

              <p className="text-xs font-medium text-text-muted text-center line-clamp-1 capitalize">
                {r.meanings.length > 0
                  ? r.meanings.slice(0, 2).join(', ')
                  : r.classicalNumber
                  ? `Radical #${r.classicalNumber}`
                  : r.radical}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
