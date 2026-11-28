'use client'

/**
 * src/components/KanjiCard.tsx
 *
 * Displays detailed information about a single KanjiEntry.
 */

import { useState } from 'react'
import { ChevronDown, Lightbulb, MessageSquareQuote, Volume2, VolumeX } from 'lucide-react'
import type { KanjiEntry } from '@/lib/types'
import { useJapaneseSpeech } from '@/hooks/useJapaneseSpeech'
import { kanjiSvgPath } from '@/lib/kanji'
import { useLanguage } from '@/components/LanguageProvider'
import { renderFuriganaText } from '@/lib/ruby'

interface Props {
  entry: KanjiEntry
}

export function KanjiCard({ entry }: Props) {
  const [showFurigana, setShowFurigana] = useState(true)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [expandedVocabIdx, setExpandedVocabIdx] = useState<number | null>(null)
  const { speak, stop, isPlaying, isSupported } = useJapaneseSpeech()
  const { lang } = useLanguage()
  const hasMnemonicData = Boolean(
    entry.mnemonic ||
      (entry.components && entry.components.length > 0) ||
      (entry.soundHooks && entry.soundHooks.length > 0)
  )

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
        <div className="relative flex flex-col items-center justify-start gap-5 pt-8 pb-8 px-6 bg-gradient-to-b from-sakura/10 to-gold/10 dark:from-sakura/5 dark:to-gold/5 md:w-2/5 md:border-r border-border-color overflow-hidden flex-shrink-0">
          <div className="pattern-washi absolute inset-0 z-0"></div>
          
          <div className="relative z-10 flex gap-2 mb-1">
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
              N{entry.jlpt}
            </span>
            <span className="px-3 py-1 bg-surface border border-border-color text-text-muted text-xs font-bold rounded-full shadow-sm">
              {entry.strokes} strokes
            </span>
          </div>

          <span
            className="text-[110px] md:text-[140px] font-jp leading-none select-none text-text-main drop-shadow-sm relative z-10 my-2"
          >
            {entry.character}
          </span>

          <div className="relative z-10 flex flex-wrap gap-2 justify-center">
            {entry.readings_on.slice(0, 2).map(r => (
              <span key={r} className="text-sm font-bold text-primary tracking-wider">{r}</span>
            ))}
            {entry.readings_on.length > 0 && entry.readings_kun.length > 0 && <span className="text-border mx-1">|</span>}
            {entry.readings_kun.slice(0, 2).map(r => (
              <span key={r} className="text-sm font-bold text-secondary tracking-wider">{r}</span>
            ))}
          </div>

          {/* SVG stroke animation */}
          <div className="relative z-10 mt-3 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
              <span>✏️</span> Urutan Penulisan
            </span>
            <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-border-color rounded-2xl bg-white dark:bg-card-muted/50 flex items-center justify-center p-2 shadow-inner">
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
          <div className="px-6 py-5 md:px-8 md:py-5 border-b border-border-color bg-card-muted/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
              <span>💡</span> Arti
            </h3>
            <p className="text-xl md:text-2xl text-text-main font-bold capitalize leading-tight">
              {lang === 'id' && entry.meanings_id && entry.meanings_id.length > 0 
                ? entry.meanings_id.join(', ')
                : entry.meanings.join(' · ')}
            </p>
          </div>

          {/* ── Readings ───────────────────────────────── */}
          <div className="px-6 py-4 md:px-8 md:py-4 border-b border-border-color grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                ON&apos;YOMI
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_on.length > 0 ? (
                  entry.readings_on.map((r) => (
                    <span
                      key={r}
                      className="px-3.5 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-bold border border-primary/20"
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
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                KUN&apos;YOMI
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.readings_kun.length > 0 ? (
                  entry.readings_kun.map((r) => (
                    <span
                      key={r}
                      className="px-3.5 py-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold border border-blue-500/20"
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

          {/* ── Mnemonic & Components ─────────────────────── */}
          {hasMnemonicData && (
            <div className="px-6 py-3.5 md:px-8 border-b border-border-color bg-card-muted/15">
              <button
                type="button"
                onClick={() => setShowMnemonic((v) => !v)}
                aria-expanded={showMnemonic}
                className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb size={15} className="text-warning flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                    {lang === 'id' ? 'Mnemonic & Komponen' : 'Mnemonic & Components'}
                  </span>
                  {entry.keyword && (
                    <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-[11px] font-bold truncate">
                      {entry.keyword}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-text-muted transition-transform flex-shrink-0 ${
                    showMnemonic ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showMnemonic && (
                <div className="mt-3 space-y-2.5 text-xs sm:text-sm">
                  {entry.components && entry.components.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase text-text-subtle mr-1">
                        {lang === 'id' ? 'Bagian:' : 'Parts:'}
                      </span>
                      {entry.components.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-lg bg-surface border border-border-color text-text-main text-xs font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.mnemonic && (
                    <p className="text-text-main leading-relaxed bg-surface/80 rounded-xl p-3 border border-border-color/70">
                      {entry.mnemonic}
                    </p>
                  )}

                  {entry.soundHooks && entry.soundHooks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.soundHooks.map((sh, sIdx) => (
                        <span
                          key={`${sh.r}-${sIdx}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
                        >
                          {sh.emoji && <span>{sh.emoji}</span>}
                          <span>{sh.r}</span>
                          <span className="text-text-muted">→ {sh.hook}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Vocabulary Examples ───────────────────────── */}
          <div className="px-5 py-4 sm:px-6 md:px-8 sm:py-5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap sm:flex-nowrap flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm flex-shrink-0">📖</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Contoh Kosakata
                </h3>
                {entry.vocab && entry.vocab.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-card-muted text-text-subtle flex-shrink-0">
                    {entry.vocab.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
                <button
                  onClick={() => setShowFurigana((v) => !v)}
                  aria-pressed={showFurigana}
                  className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all duration-200 shadow-sm active:scale-95 ${
                    showFurigana
                      ? 'bg-primary text-white border-primary hover:bg-primary-hover shadow-primary/20'
                      : 'border-border-color bg-surface text-text-muted hover:text-text-main hover:bg-card-muted'
                  }`}
                >
                  Furigana
                </button>
                {isSupported && (
                  <button
                    onClick={handleAudio}
                    aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 transition-all shadow-sm active:scale-95 flex-shrink-0"
                  >
                    {isPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] md:max-h-[340px] overflow-y-auto pr-2 scrollbar-thin">
              {entry.vocab && entry.vocab.length > 0 ? (
                entry.vocab.map((v, i) => {
                  const hasExtras = Boolean((v.examples && v.examples.length > 0) || v.mnemonic)
                  const isExpanded = expandedVocabIdx === i
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-border-color bg-card-muted/20 hover:bg-card-muted/60 transition-colors overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-3 sm:p-3.5 gap-2.5 sm:gap-3.5">
                        {/* 1. Kanji & Furigana */}
                        <div className="flex-shrink-0 min-w-[65px] sm:min-w-[85px] flex items-center justify-start">
                          <ruby className="text-xl sm:text-2xl font-medium text-text-main tracking-wide font-jp">
                            {v.word}
                            {showFurigana && v.reading && (
                              <rt className="text-[10px] sm:text-xs text-text-muted mb-0.5 font-normal tracking-normal">
                                {v.reading}
                              </rt>
                            )}
                          </ruby>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-7 bg-border-color flex-shrink-0" />

                        {/* 2. Arti (bisa di scroll kalo banyak) */}
                        <div className="flex-1 min-w-0 max-h-12 overflow-y-auto pr-1 scrollbar-thin">
                          <p className="text-xs sm:text-sm text-text-muted capitalize font-medium leading-snug">
                            {lang === 'id' && v.meanings_id && v.meanings_id.length > 0
                              ? v.meanings_id.join(', ')
                              : v.meanings.join(', ')}
                          </p>
                        </div>

                        {/* 3. Sentence / Mnemonic Toggle & Sound Button */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {hasExtras && (
                            <button
                              type="button"
                              onClick={() => setExpandedVocabIdx(isExpanded ? null : i)}
                              aria-expanded={isExpanded}
                              title={lang === 'id' ? 'Contoh kalimat & catatan' : 'Example sentences & tip'}
                              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                isExpanded
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-surface border-border-color text-text-muted hover:text-primary'
                              }`}
                            >
                              <MessageSquareQuote size={12} />
                              <span className="hidden sm:inline">
                                {v.examples && v.examples.length > 0
                                  ? `${v.examples.length}`
                                  : 'Tip'}
                              </span>
                            </button>
                          )}

                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isPlaying) stop()
                                speak(v.word)
                              }}
                              className="w-8 h-8 rounded-full bg-surface border border-border-color hover:border-primary text-primary flex items-center justify-center transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
                              title={`Dengarkan ${v.word}`}
                              aria-label={`Dengarkan ${v.word}`}
                            >
                              <Volume2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {hasExtras && isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2 border-t border-border-color/60 bg-surface/60 space-y-2">
                          {v.mnemonic && (
                            <p className="text-xs text-text-main bg-warning/10 border border-warning/20 rounded-xl px-3 py-2 leading-relaxed">
                              <span className="font-bold text-warning mr-1">Tip:</span>
                              {v.mnemonic}
                            </p>
                          )}
                          {v.examples?.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="flex items-start justify-between gap-2 text-xs bg-card-muted/30 rounded-xl px-3 py-2 border border-border-color/50"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-text-main font-medium leading-loose font-jp">
                                  {renderFuriganaText(ex.furigana ?? ex.ja, showFurigana)}
                                </p>
                                <p className="text-text-muted mt-0.5">{ex.en}</p>
                              </div>
                              {isSupported && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isPlaying) stop()
                                    speak(ex.ja)
                                  }}
                                  className="w-7 h-7 rounded-full bg-surface border border-border-color hover:border-primary text-primary flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer"
                                  title={lang === 'id' ? 'Putar kalimat' : 'Play sentence'}
                                  aria-label={lang === 'id' ? 'Putar kalimat' : 'Play sentence'}
                                >
                                  <Volume2 size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
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
