'use client'

/**
 * src/components/KanjiCard.tsx
 *
 * Displays detailed information about a single KanjiEntry.
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
    <div className="w-full max-w-md md:max-w-5xl mx-auto bg-surface rounded-3xl border border-border-color overflow-hidden shadow-xl shadow-black/5">
      <div className="md:flex h-full">
        {/* ── Hero ───────────────────────────────────── */}
        <div className="relative flex flex-col items-center justify-center gap-6 pt-12 pb-10 px-6 bg-gradient-to-b from-sakura/10 to-gold/10 dark:from-sakura/5 dark:to-gold/5 md:w-2/5 md:border-r border-border-color overflow-hidden">
          <div className="pattern-washi absolute inset-0 z-0"></div>
          
          <div className="relative z-10 flex gap-2 mb-4">
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
              N{entry.jlpt}
            </span>
            <span className="px-3 py-1 bg-surface border border-border-color text-text-muted text-xs font-bold rounded-full shadow-sm">
              {entry.strokes} strokes
            </span>
          </div>

          <span
            className="text-[140px] md:text-[180px] font-serif leading-none select-none text-text-main drop-shadow-sm relative z-10"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {entry.character}
          </span>

          <div className="relative z-10 flex flex-wrap gap-2 justify-center mt-2">
            {entry.readings_on.slice(0, 2).map(r => (
              <span key={r} className="text-sm font-bold text-primary tracking-wider">{r}</span>
            ))}
            {entry.readings_on.length > 0 && entry.readings_kun.length > 0 && <span className="text-border mx-1">|</span>}
            {entry.readings_kun.slice(0, 2).map(r => (
              <span key={r} className="text-sm font-bold text-secondary tracking-wider">{r}</span>
            ))}
          </div>

          {/* SVG stroke animation */}
          <div className="relative z-10 mt-6 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
              <span>✏️</span> Urutan Penulisan
            </span>
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-border-color rounded-2xl bg-white dark:bg-card-muted/50 flex items-center justify-center p-2 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={kanjiSvgPath(entry.character)}
                alt={`Stroke order for ${entry.character}`}
                className="w-full h-full object-contain opacity-80 mix-blend-multiply dark:mix-blend-normal dark:invert"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div className="md:w-3/5 flex flex-col bg-surface relative z-10">
          
          {/* ── Meanings ───────────────────────────────── */}
          <div className="px-8 py-8 border-b border-border-color bg-card-muted/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
              <span>💡</span> Arti
            </h3>
            <p className="text-2xl md:text-3xl text-text-main font-bold capitalize leading-tight">
              {lang === 'id' && entry.meanings_id && entry.meanings_id.length > 0 
                ? entry.meanings_id.join(', ')
                : entry.meanings.join(' · ')}
            </p>
          </div>

          {/* ── Readings ───────────────────────────────── */}
          <div className="px-8 py-8 border-b border-border-color grid md:grid-cols-2 gap-8 md:gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
                ON&apos;YOMI
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_on.length > 0 ? (
                  entry.readings_on.map((r) => (
                    <span
                      key={r}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold border border-primary/20"
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-subtle italic">Tidak ada</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
                KUN&apos;YOMI
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_kun.length > 0 ? (
                  entry.readings_kun.map((r) => (
                    <span
                      key={r}
                      className="px-4 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold border border-blue-500/20"
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-subtle italic">Tidak ada</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Vocabulary Examples ───────────────────────── */}
          <div className="px-8 py-8 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <span>📖</span> Contoh Kosakata
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFurigana((v) => !v)}
                  className="text-xs px-4 py-2 rounded-full border border-border-color text-text-main hover:bg-card-muted transition-colors font-bold shadow-sm"
                >
                  Furigana: {showFurigana ? 'ON' : 'OFF'}
                </button>
                {isSupported && (
                  <button
                    onClick={handleAudio}
                    aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 transition-all shadow-md"
                  >
                    {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {entry.vocab && entry.vocab.length > 0 ? (
                entry.vocab.map((v, i) => (
                  <div key={i} className="flex flex-col p-4 rounded-2xl border border-border-color bg-card-muted/20 hover:bg-card-muted transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <ruby className="text-3xl font-medium text-text-main tracking-wide">
                        {v.word}
                        {showFurigana && v.reading && (
                          <rt className="text-sm text-text-muted mb-1 font-normal tracking-normal">{v.reading}</rt>
                        )}
                      </ruby>
                      {isSupported && (
                        <button
                          onClick={() => {
                            if (isPlaying) stop()
                            speak(v.word)
                          }}
                          className="w-9 h-9 rounded-full bg-surface border border-border-color hover:border-primary text-primary flex items-center justify-center transition-all shadow-sm"
                          title={`Dengarkan ${v.word}`}
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-text-muted capitalize font-medium">
                      {lang === 'id' && v.meanings_id && v.meanings_id.length > 0
                        ? v.meanings_id.join(', ')
                        : v.meanings.join(', ')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center border border-dashed border-border-color rounded-2xl">
                  <p className="text-sm text-text-subtle font-medium">Belum ada contoh kosakata.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
