'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Grid2x2,
  RotateCcw,
  Search,
  Type,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { DokkaiPassage, KanjiReferenceItem } from '@/lib/types'
import { useLanguage } from '@/components/LanguageProvider'
import { useJapaneseSpeech } from '@/hooks/useJapaneseSpeech'
import { MondaiInstruction } from '@/components/MondaiInstruction'

const STORAGE_KEY = 'kanjipaham-dokkai-done'

const KIND_LABELS: Record<string, { id: string; en: string; badge: string }> = {
  short: { id: 'Pendek', en: 'Short', badge: 'bg-success/15 text-success' },
  medium: { id: 'Sedang', en: 'Medium', badge: 'bg-secondary/15 text-secondary' },
  info: { id: 'Info / Jadwal', en: 'Notice / Info', badge: 'bg-warning/15 text-warning' },
  long: { id: 'Panjang', en: 'Long', badge: 'bg-primary/15 text-primary' },
}

const FONT_SIZES = ['text-base leading-loose', 'text-lg leading-loose', 'text-xl leading-loose'] as const
const KANJI_CHAR_REGEX = /[\u4e00-\u9faf\u3400-\u4dbf]/g

function extractUniqueKanji(passage: DokkaiPassage): string[] {
  const combined = [
    passage.text,
    ...passage.questions.flatMap((q) => [q.prompt, ...q.options]),
  ].join(' ')
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const match of combined.matchAll(KANJI_CHAR_REGEX)) {
    const ch = match[0]
    if (!seen.has(ch)) {
      seen.add(ch)
      ordered.push(ch)
    }
  }
  return ordered
}

interface Props {
  passages: DokkaiPassage[]
  kanjiMap: Record<string, KanjiReferenceItem>
}

export function DokkaiPractice({ passages, kanjiMap }: Props) {
  const { lang } = useLanguage()
  const isId = lang === 'id'
  const { speak, stop, isPlaying, isSupported } = useJapaneseSpeech()

  const [kindFilter, setKindFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [query, setQuery] = useState('')
  const [doneIds, setDoneIds] = useState<string[]>([])

  const [activeId, setActiveId] = useState<string | null>(null)
  const [fontIdx, setFontIdx] = useState<number>(1)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showOptionEn, setShowOptionEn] = useState(false)
  const [showKanjiRef, setShowKanjiRef] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as unknown
          if (Array.isArray(parsed)) {
            setDoneIds(parsed.filter((x): x is string => typeof x === 'string'))
          }
        }
      } catch {
        // ignore storage errors
      }
    })
    return () => window.cancelAnimationFrame(id)
  }, [])

  const kindCounts = useMemo(() => {
    const counts: Record<string, number> = { all: passages.length, short: 0, medium: 0, info: 0, long: 0 }
    for (const p of passages) {
      counts[p.kind] = (counts[p.kind] ?? 0) + 1
    }
    return counts
  }, [passages])

  const filteredPassages = useMemo(() => {
    const q = query.trim().toLowerCase()
    return passages.filter((p) => {
      if (kindFilter !== 'all' && p.kind !== kindFilter) return false
      const isDone = doneIds.includes(p.id)
      if (statusFilter === 'done' && !isDone) return false
      if (statusFilter === 'todo' && isDone) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    })
  }, [passages, kindFilter, statusFilter, query, doneIds])

  const activePassage = useMemo(
    () => passages.find((p) => p.id === activeId) ?? null,
    [passages, activeId]
  )

  const passageKanjiChars = useMemo(
    () => (activePassage ? extractUniqueKanji(activePassage) : []),
    [activePassage]
  )

  function openPassage(id: string) {
    stop()
    setActiveId(id)
    setShowTranslation(false)
    setShowOptionEn(false)
    setShowKanjiRef(false)
    setAnswers({})
  }

  function closePassage() {
    stop()
    setActiveId(null)
  }

  function markDone(id: string) {
    if (doneIds.includes(id)) return
    const next = [...doneIds, id]
    setDoneIds(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors
    }
  }

  function selectAnswer(qIdx: number, optIdx: number) {
    if (answers[qIdx] !== undefined || !activePassage) return
    const next = { ...answers, [qIdx]: optIdx }
    setAnswers(next)
    if (Object.keys(next).length >= activePassage.questions.length) {
      markDone(activePassage.id)
    }
  }

  // ── Active Reader View ──────────────────────────────────────────────────────
  if (activePassage) {
    const kindMeta = KIND_LABELS[activePassage.kind] ?? {
      id: activePassage.kind,
      en: activePassage.kind,
      badge: 'bg-card-muted text-text-muted',
    }
    const answeredCount = Object.keys(answers).length
    const allAnswered = answeredCount >= activePassage.questions.length
    const correctCount = activePassage.questions.reduce(
      (acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc),
      0
    )

    const currentIdx = filteredPassages.findIndex((p) => p.id === activePassage.id)
    const nextPassage =
      currentIdx >= 0 && currentIdx + 1 < filteredPassages.length
        ? filteredPassages[currentIdx + 1]
        : null

    return (
      <div className="max-w-3xl mx-auto pb-28">
        {/* Top Controls */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            onClick={closePassage}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-primary font-semibold bg-surface px-3.5 py-2 rounded-full border border-border-color shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            {isId ? 'Daftar Bacaan' : 'Passage List'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontIdx((i) => (i + 1) % FONT_SIZES.length)}
              className="px-3 py-2 rounded-full border border-border-color bg-surface text-xs font-bold text-text-main hover:border-primary/50 flex items-center gap-1.5 shadow-sm cursor-pointer"
              title={isId ? 'Ubah ukuran huruf' : 'Change font size'}
            >
              <Type size={14} />
              <span>A{fontIdx === 0 ? '-' : fontIdx === 2 ? '+' : ''}</span>
            </button>

            {isSupported && (
              <button
                onClick={() => (isPlaying ? stop() : speak(activePassage.text))}
                className={`px-3 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border-color text-text-main hover:border-primary/50'
                }`}
                aria-label={isPlaying ? 'Stop audio' : 'Play passage audio'}
              >
                {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Audio'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Passage Card */}
        <div className="bg-surface rounded-3xl border border-border-color p-5 sm:p-7 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${kindMeta.badge}`}>
              {isId ? kindMeta.id : kindMeta.en}
            </span>
            <span className="text-xs font-semibold text-text-subtle uppercase">
              {activePassage.id}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-text-main mb-4">
            {activePassage.title}
          </h1>

          <div
            className={`whitespace-pre-line text-text-main bg-card-muted/25 rounded-2xl p-4 sm:p-5 border border-border-color/70 font-jp ${FONT_SIZES[fontIdx]}`}
          >
            {activePassage.text}
          </div>

          {/* Translation Toggle */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-color bg-surface hover:bg-card-muted text-xs font-bold text-text-main transition-colors cursor-pointer"
            >
              {showTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>
                {showTranslation
                  ? isId ? 'Sembunyikan Terjemahan' : 'Hide Translation'
                  : isId ? 'Lihat Terjemahan (EN)' : 'Show Translation'}
              </span>
            </button>

            <button
              onClick={() => setShowOptionEn((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-color bg-surface hover:bg-card-muted text-xs font-bold text-text-muted transition-colors cursor-pointer"
            >
              {showOptionEn ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>
                {isId ? 'Arti Opsi' : 'Option Gloss'}
              </span>
            </button>

            <button
              onClick={() => setShowKanjiRef((v) => !v)}
              aria-expanded={showKanjiRef}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                showKanjiRef
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-border-color text-primary hover:bg-primary/5'
              }`}
            >
              <Grid2x2 size={14} />
              <span>
                {isId
                  ? `Referensi Kanji (${passageKanjiChars.length})`
                  : `Kanji Reference (${passageKanjiChars.length})`}
              </span>
            </button>
          </div>

          {showTranslation && (
            <div className="mt-3 p-4 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-text-main leading-relaxed">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                English Translation
              </p>
              {activePassage.en}
            </div>
          )}

          {showKanjiRef && (
            <div className="mt-3 p-4 rounded-2xl bg-card-muted/35 border border-border-color">
              <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                <p className="text-xs font-bold uppercase tracking-wider text-text-main">
                  {isId ? 'Kanji di Bacaan Ini' : 'Kanji in This Passage'}
                </p>
                <span className="text-[11px] text-text-muted">
                  {isId
                    ? 'Klik kanji untuk membuka detail di tab baru'
                    : 'Click any kanji to open details in a new tab'}
                </span>
              </div>

              {passageKanjiChars.length === 0 ? (
                <p className="text-xs text-text-subtle">
                  {isId ? 'Tidak ada kanji di bacaan ini.' : 'No kanji found in this passage.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {passageKanjiChars.map((ch) => {
                    const info = kanjiMap[ch]
                    if (!info) {
                      return (
                        <div
                          key={ch}
                          className="p-2.5 rounded-xl border border-dashed border-border-color bg-surface/60 flex items-center gap-2.5 opacity-75"
                        >
                          <span
                            className="text-2xl font-bold text-text-main font-jp"
                          >
                            {ch}
                          </span>
                          <span className="text-[10px] text-text-subtle leading-tight">
                            {isId ? 'Di luar JLPT N5–N1' : 'Outside JLPT N5–N1'}
                          </span>
                        </div>
                      )
                    }

                    const meaningText =
                      isId && info.meanings_id && info.meanings_id.length > 0
                        ? info.meanings_id[0]
                        : info.meanings[0] ?? ''

                    return (
                      <Link
                        key={ch}
                        href={`/learn/${info.jlpt}/${info.subLevel}/${encodeURIComponent(info.character)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2.5 rounded-xl border border-border-color bg-surface hover:border-primary hover:shadow-sm transition-all flex items-center justify-between gap-2 min-w-0"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="text-2xl font-bold text-text-main group-hover:text-primary transition-colors flex-shrink-0 font-jp"
                          >
                            {info.character}
                          </span>
                          <div className="min-w-0">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                              N{info.jlpt}
                            </span>
                            <p className="text-[11px] font-medium text-text-muted truncate capitalize mt-0.5">
                              {meaningText}
                            </p>
                          </div>
                        </div>
                        <ExternalLink
                          size={13}
                          className="text-text-subtle group-hover:text-primary flex-shrink-0"
                        />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Questions */}
        <MondaiInstruction
          jp="問題：次の文章を読んで、後の問いに対する答えとして最もよいものを、1・2・3・4から一つ選びなさい。"
          guideId="Cara mengerjakan: Baca wacana di atas, lalu pilih 1 jawaban paling tepat dari opsi 1, 2, 3, atau 4 untuk setiap pertanyaan."
          guideEn="How to answer: Read the passage above and choose the 1 best answer from options 1, 2, 3, or 4 for each question."
          lang={lang}
        />

        <div className="space-y-5">
          {activePassage.questions.map((q, qIdx) => {
            const chosen = answers[qIdx]
            const isAnswered = chosen !== undefined
            const isCorrect = chosen === q.answer
            const wrongReason =
              isAnswered && !isCorrect && q.wrong ? q.wrong[String(chosen)] : undefined

            return (
              <div
                key={qIdx}
                className="bg-surface rounded-3xl border border-border-color p-5 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {isId ? `Soal ${qIdx + 1}` : `Question ${qIdx + 1}`} / {activePassage.questions.length}
                  </span>
                </div>

                <p
                  className="text-base sm:text-lg font-bold text-text-main leading-relaxed mb-4 font-jp"
                >
                  {q.prompt}
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const optCorrect = optIdx === q.answer
                    const optSelected = chosen === optIdx
                    const optWrong = optSelected && !optCorrect

                    let style =
                      'border-border-color bg-surface text-text-main hover:border-primary/60'
                    if (isAnswered) {
                      if (optCorrect) {
                        style = 'border-success bg-success/15 text-success font-bold'
                      } else if (optWrong) {
                        style = 'border-error bg-error/15 text-error font-bold'
                      } else {
                        style = 'border-border-color bg-card-muted/40 text-text-subtle opacity-70'
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectAnswer(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 disabled:cursor-default cursor-pointer ${style}`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                            !isAnswered
                              ? 'bg-card-muted text-text-muted'
                              : optCorrect
                              ? 'bg-success text-white'
                              : optWrong
                              ? 'bg-error text-white'
                              : 'bg-card-muted text-text-subtle'
                          }`}
                        >
                          {isAnswered && optCorrect ? '✓' : isAnswered && optWrong ? '✕' : ['1', '2', '3', '4'][optIdx]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium leading-snug font-jp">{opt}</p>
                          {(showOptionEn || isAnswered) && q.optsEn?.[optIdx] && (
                            <p className="text-xs text-text-muted mt-1">{q.optsEn[optIdx]}</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border-2 text-sm space-y-1.5 ${
                      isCorrect
                        ? 'bg-success/10 border-success/30'
                        : 'bg-error/10 border-error/30'
                    }`}
                  >
                    <p className={`font-bold ${isCorrect ? 'text-success' : 'text-error'}`}>
                      {isCorrect
                        ? isId ? '✓ Jawaban Benar!' : '✓ Correct!'
                        : isId ? '✕ Kurang Tepat' : '✕ Not Quite Right'}
                    </p>
                    {wrongReason && (
                      <p className="text-text-main leading-relaxed">
                        <span className="font-semibold">
                          {isId ? 'Kenapa pilihanmu salah: ' : 'Why your choice is wrong: '}
                        </span>
                        {wrongReason}
                      </p>
                    )}
                    {q.why && (
                      <p className="text-text-muted leading-relaxed">
                        <span className="font-semibold text-text-main">
                          {isId ? 'Pembahasan: ' : 'Explanation: '}
                        </span>
                        {q.why}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Passage Completion Footer */}
        {allAnswered && (
          <div className="mt-6 bg-surface rounded-3xl border border-border-color p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-text-main">
                {isId
                  ? `Selesai! Skor wacana ini: ${correctCount} / ${activePassage.questions.length}`
                  : `Done! Score for this passage: ${correctCount} / ${activePassage.questions.length}`}
              </p>
              <p className="text-xs text-text-muted">
                {isId ? 'Status selesai tersimpan di perangkat ini.' : 'Completion saved locally.'}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openPassage(activePassage.id)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border-color bg-surface hover:bg-card-muted text-xs font-bold text-text-main flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                {isId ? 'Ulangi' : 'Retry'}
              </button>
              {nextPassage && (
                <button
                  onClick={() => openPassage(nextPassage.id)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isId ? 'Berikutnya' : 'Next'}
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Passage List / Hub ──────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="mb-5">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-primary font-semibold bg-surface px-3.5 py-2 rounded-full border border-border-color shadow-sm mb-4"
        >
          <ArrowLeft size={16} />
          {isId ? 'Kembali ke Hub Latihan' : 'Back to Practice Hub'}
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
              {isId ? 'Latihan Dokkai (読解)' : 'Dokkai Reading Practice'}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {isId
                ? `${passages.length} wacana bacaan Jepang · ${doneIds.length} selesai`
                : `${passages.length} Japanese reading passages · ${doneIds.length} completed`}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Status */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isId ? 'Cari judul atau kata Jepang...' : 'Search title or Japanese text...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border-color bg-surface text-sm text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-surface border border-border-color rounded-2xl p-1">
          {(['all', 'todo', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {s === 'all'
                ? isId ? 'Semua' : 'All'
                : s === 'todo'
                ? isId ? 'Belum' : 'To Do'
                : isId ? 'Selesai' : 'Done'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
        {(['all', 'short', 'medium', 'info', 'long'] as const).map((k) => {
          const label =
            k === 'all'
              ? isId ? 'Semua' : 'All'
              : isId ? KIND_LABELS[k].id : KIND_LABELS[k].en
          const active = kindFilter === k
          return (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                active
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-border-color text-text-muted hover:text-text-main'
              }`}
            >
              {label} ({kindCounts[k] ?? 0})
            </button>
          )
        })}
      </div>

      {/* Passages Grid */}
      {filteredPassages.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-dashed border-border-color p-8 text-center text-sm text-text-muted">
          {isId ? 'Tidak ada wacana yang cocok dengan filter.' : 'No passages match your filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredPassages.map((p) => {
            const isDone = doneIds.includes(p.id)
            const kindMeta = KIND_LABELS[p.kind] ?? {
              id: p.kind,
              en: p.kind,
              badge: 'bg-card-muted text-text-muted',
            }
            const snippet = p.text.replace(/\s+/g, ' ').slice(0, 56)

            return (
              <button
                key={p.id}
                onClick={() => openPassage(p.id)}
                className="group text-left bg-surface rounded-2xl border-2 border-border-color hover:border-primary p-4 transition-all hover:shadow-md active:scale-[0.99] cursor-pointer flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${kindMeta.badge}`}>
                      {isId ? kindMeta.id : kindMeta.en}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isDone && <CheckCircle2 size={16} className="text-success" />}
                      <span className="text-[11px] font-semibold text-text-subtle">
                        {p.questions.length} {isId ? 'soal' : 'Q'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-text-main group-hover:text-primary transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p
                    className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed font-jp"
                  >
                    {snippet}…
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-primary pt-2 border-t border-border-color/50">
                  <span>{isId ? 'Baca & Jawab' : 'Read & Answer'}</span>
                  <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
