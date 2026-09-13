'use client'

/**
 * src/components/KanjiCard.tsx
 *
 * Displays detailed information about a single KanjiEntry.
 * Phase 3: full implementation with SVG stroke animation, readings grid,
 * furigana example sentences, and audio controls.
 */

import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { KanjiEntry } from '@/lib/types'
import { useJapaneseSpeech } from '@/hooks/useJapaneseSpeech'
import { kanjiSvgPath } from '@/lib/kanji'
import { useLanguage } from '@/components/LanguageProvider'

interface Props {
  entry: KanjiEntry
}

export function KanjiCard({ entry }: Props) {
  const [showFurigana, setShowFurigana] = useState(true)
  const { speak, stop, isPlaying, isSupported } = useJapaneseSpeech()
  const { lang } = useLanguage()

  function handleAudio() {
    if (isPlaying) {
      stop()
    } else {
      speak(entry.character)
    }
  }

  return (
    <div className="w-full max-w-md md:max-w-4xl mx-auto bg-surface rounded-2xl border border-border-color overflow-hidden shadow-sm">
      <div className="md:flex">
        {/* ── Hero ───────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-6 px-6 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/20 md:w-1/3 md:border-r border-border-color">
          <span
            className="text-8xl md:text-9xl font-serif leading-none select-none text-text-main"
            style={{ fontFamily: "'Noto Serif JP', 'Yu Mincho', serif" }}
          >
            {entry.character}
          </span>

          {/* SVG stroke animation */}
          <div className="w-40 h-40 md:w-48 md:h-48 border border-border-color rounded-xl bg-[#FFF9F2] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={kanjiSvgPath(entry.character)}
              alt={`Stroke order for ${entry.character}`}
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted font-medium mt-2">
            <span>{entry.strokes} strokes</span>
            <span>·</span>
            <span className="text-primary">N{entry.jlpt}</span>
            {entry.grade && (
              <>
                <span>·</span>
                <span>Grade {entry.grade}</span>
              </>
            )}
          </div>
        </div>

        <div className="md:w-2/3 flex flex-col">
          {/* ── Readings ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 px-6 py-5 border-t md:border-t-0 border-border-color">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                On&apos;yomi
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_on.length > 0 ? (
                  entry.readings_on.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20"
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-muted">—</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Kun&apos;yomi
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_kun.length > 0 ? (
                  entry.readings_kun.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/20"
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-muted">—</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Meanings ───────────────────────────────── */}
          <div className="px-6 py-4 border-t border-border-color flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Arti</p>
            <p className="text-lg text-text-main font-medium capitalize">
              {lang === 'id' && entry.meanings_id && entry.meanings_id.length > 0 
                ? entry.meanings_id.join(', ')
                : entry.meanings.join(' · ')}
            </p>
          </div>

          {/* ── Vocabulary Examples ───────────────────────── */}
          <div className="px-6 py-5 border-t border-border-color bg-surface/50 overflow-y-auto max-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Contoh Kosakata
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFurigana((v) => !v)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border-color text-text-main hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Furigana: {showFurigana ? 'ON' : 'OFF'}
                </button>
                {isSupported && (
                  <button
                    onClick={handleAudio}
                    aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
                  >
                    {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {entry.vocab && entry.vocab.length > 0 ? (
                entry.vocab.map((v, i) => (
                  <div key={i} className="flex flex-col border-b border-border-color pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <ruby className="text-3xl font-medium text-text-main">
                        {v.word}
                        {showFurigana && v.reading && (
                          <rt className="text-sm text-text-muted mb-1">{v.reading}</rt>
                        )}
                      </ruby>
                      {isSupported && (
                        <button
                          onClick={() => {
                            if (isPlaying) stop()
                            speak(v.word)
                          }}
                          className="w-8 h-8 rounded-full border border-border-color bg-surface hover:bg-slate-100 dark:hover:bg-slate-700 text-text-muted flex items-center justify-center transition-colors"
                          title={`Dengarkan ${v.word}`}
                        >
                          <Volume2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-muted capitalize">
                      {lang === 'id' && v.meanings_id && v.meanings_id.length > 0
                        ? v.meanings_id.join(', ')
                        : v.meanings.join(', ')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted italic">Belum ada contoh kosakata.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

