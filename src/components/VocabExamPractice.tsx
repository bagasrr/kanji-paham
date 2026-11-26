'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Languages,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { VocabExamQuestion, VocabExamUsageWrongDetail } from '@/lib/types'
import { useLanguage } from '@/components/LanguageProvider'

type QuizModeFilter = 'all' | 'para' | 'usage'
type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface Props {
  counts: { all: number; para: number; usage: number }
}

function isUsageDetail(
  value: string | VocabExamUsageWrongDetail | undefined
): value is VocabExamUsageWrongDetail {
  return typeof value === 'object' && value !== null && 'why' in value
}

export function VocabExamPractice({ counts }: Props) {
  const { lang } = useLanguage()
  const isId = lang === 'id'

  const [mode, setMode] = useState<QuizModeFilter | null>(null)
  const [questions, setQuestions] = useState<VocabExamQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [showGloss, setShowGloss] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  async function startSession(selectedMode: QuizModeFilter) {
    setMode(selectedMode)
    setLoading(true)
    try {
      const res = await fetch(`/api/exercises/vocab?mode=${selectedMode}&limit=20`)
      if (res.ok) {
        const data = (await res.json()) as { questions: VocabExamQuestion[] }
        setQuestions(data.questions)
        setIdx(0)
        setSelected(null)
        setAnswerState('unanswered')
        setShowGloss(false)
        setScore(0)
        setDone(false)
      }
    } finally {
      setLoading(false)
    }
  }

  function selectAnswer(optIdx: number) {
    if (answerState !== 'unanswered' || !questions[idx]) return
    const correct = optIdx === questions[idx].answer
    setSelected(optIdx)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 1)
  }

  function goNext() {
    if (idx + 1 >= questions.length) {
      setDone(true)
      return
    }
    setIdx((i) => i + 1)
    setSelected(null)
    setAnswerState('unanswered')
    setShowGloss(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-muted">
          {isId ? 'Menyiapkan soal kosakata kontekstual...' : 'Preparing contextual vocabulary questions...'}
        </p>
      </div>
    )
  }

  if (done && mode) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    return (
      <div className="max-w-md mx-auto py-8 pb-28">
        <div className="bg-surface rounded-3xl border border-border-color p-7 text-center shadow-sm mb-5">
          <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '📚'}</div>
          <h2 className="text-2xl font-bold text-text-main mb-1">
            {pct >= 80
              ? isId ? 'Luar Biasa!' : 'Awesome!'
              : pct >= 50
              ? isId ? 'Bagus!' : 'Well Done!'
              : isId ? 'Terus Berlatih!' : 'Keep Practicing!'}
          </h2>
          <p className="text-sm text-text-muted mb-5">
            {score} / {questions.length} ({pct}%)
          </p>
          <div className="space-y-3">
            <button
              onClick={() => startSession(mode)}
              className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              {isId ? 'Latihan 20 Soal Lagi' : 'Practice 20 More'}
            </button>
            <button
              onClick={() => {
                setMode(null)
                setDone(false)
              }}
              className="w-full py-3.5 rounded-2xl border-2 border-border-color bg-surface text-text-main font-semibold text-sm cursor-pointer"
            >
              {isId ? 'Pilih Mode Lain' : 'Choose Another Mode'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active Question ──────────────────────────────────────────────────────────
  if (mode && questions.length > 0 && questions[idx]) {
    const q = questions[idx]
    const progressPct = (idx / questions.length) * 100
    const isAnswered = answerState !== 'unanswered'
    const wrongEntry =
      isAnswered && answerState === 'wrong' && selected !== null && q.wrong
        ? q.wrong[String(selected)]
        : undefined

    return (
      <div className="max-w-2xl mx-auto pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setMode(null)}
            className="w-10 h-10 rounded-full border border-border-color bg-surface flex items-center justify-center text-text-muted hover:text-primary cursor-pointer flex-shrink-0"
            aria-label={isId ? 'Kembali' : 'Back'}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold uppercase tracking-wider text-primary">
                {q.mode === 'para'
                  ? isId ? 'Parafrasa Kata' : 'Paraphrase'
                  : isId ? 'Pemakaian Kalimat' : 'Context Usage'}
              </span>
              <span className="font-semibold text-text-muted">
                <strong className="text-text-main">{idx + 1}</strong> / {questions.length}
              </span>
            </div>
            <div className="h-2 bg-card-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="bg-surface rounded-3xl border border-border-color p-5 sm:p-7 mb-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
              {q.targetWord}
            </span>
            <button
              onClick={() => setShowGloss((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary cursor-pointer"
            >
              {showGloss ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{isId ? 'Arti (EN)' : 'Meaning'}</span>
            </button>
          </div>
          <p
            className="text-lg sm:text-xl font-bold text-text-main leading-relaxed"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {q.prompt}
          </p>
          {(showGloss || isAnswered) && q.en && (
            <p className="mt-3 text-xs sm:text-sm text-text-muted border-t border-border-color/60 pt-2.5">
              {q.en}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {q.options.map((opt, optIdx) => {
            const optCorrect = optIdx === q.answer
            const optSelected = selected === optIdx
            const optWrong = optSelected && !optCorrect

            let stateClass =
              'border-border-color bg-surface text-text-main hover:border-primary/60'
            if (isAnswered) {
              if (optCorrect) {
                stateClass = 'border-success bg-success/15 text-success font-bold'
              } else if (optWrong) {
                stateClass = 'border-error bg-error/15 text-error font-bold'
              } else {
                stateClass = 'border-border-color bg-card-muted/40 text-text-subtle opacity-70'
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => selectAnswer(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 disabled:cursor-default cursor-pointer ${stateClass}`}
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
                  {isAnswered && optCorrect ? '✓' : isAnswered && optWrong ? '✕' : ['A', 'B', 'C', 'D'][optIdx]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium leading-relaxed">{opt}</p>
                  {(showGloss || isAnswered) && q.optsEn?.[optIdx] && (
                    <p className="text-xs text-text-muted mt-1">{q.optsEn[optIdx]}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Rich Feedback */}
        {isAnswered && (
          <div className="mt-5 space-y-3">
            <div
              className={`p-4 rounded-2xl border-2 text-sm space-y-2 ${
                answerState === 'correct'
                  ? 'bg-success/10 border-success/30'
                  : 'bg-error/10 border-error/30'
              }`}
            >
              <p className={`font-bold ${answerState === 'correct' ? 'text-success' : 'text-error'}`}>
                {answerState === 'correct'
                  ? isId ? '✓ Benar!' : '✓ Correct!'
                  : isId ? '✕ Kurang tepat' : '✕ Not quite right'}
              </p>

              {typeof wrongEntry === 'string' && (
                <p className="text-text-main leading-relaxed">{wrongEntry}</p>
              )}

              {isUsageDetail(wrongEntry) && (
                <div className="space-y-1 text-text-main">
                  <p className="leading-relaxed">{wrongEntry.why}</p>
                  {wrongEntry.fix && (
                    <p className="text-xs bg-surface/80 rounded-xl p-2.5 border border-border-color">
                      <span className="font-bold text-primary block mb-0.5">
                        {isId ? 'Kalimat yang benar:' : 'Corrected sentence:'}
                      </span>
                      {wrongEntry.fix}
                      {wrongEntry.fixEn && (
                        <span className="block text-text-muted mt-0.5">{wrongEntry.fixEn}</span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {q.why && (
                <p className="text-text-muted leading-relaxed">
                  <span className="font-semibold text-text-main">
                    {isId ? 'Pembahasan: ' : 'Why: '}
                  </span>
                  {q.why}
                </p>
              )}
            </div>

            <button
              onClick={goNext}
              className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {idx + 1 >= questions.length
                ? isId ? 'Lihat Hasil 🏆' : 'View Results 🏆'
                : isId ? 'Soal Berikutnya' : 'Next Question'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Mode Selection Hub ──────────────────────────────────────────────────────
  const modeCards: Array<{
    key: QuizModeFilter
    badge: string
    titleId: string
    titleEn: string
    descId: string
    descEn: string
    count: number
  }> = [
    {
      key: 'all',
      badge: 'Mix',
      titleId: 'Campuran Kontekstual (20 Soal)',
      titleEn: 'Mixed Contextual Drill (20 Qs)',
      descId: 'Gabungan acak soal parafrasa dan ketepatan pemakaian kata dalam kalimat.',
      descEn: 'Random mix of paraphrase and contextual word usage questions.',
      count: counts.all,
    },
    {
      key: 'para',
      badge: '類義語',
      titleId: 'Parafrasa / Sinonim dalam Kalimat',
      titleEn: 'Paraphrase in Context',
      descId: 'Tebak arti paling tepat untuk kata bertanda 【...】 di dalam kalimat.',
      descEn: 'Choose the closest expression for the bracketed 【...】 word.',
      count: counts.para,
    },
    {
      key: 'usage',
      badge: '用法',
      titleId: 'Ketepatan Pemakaian Kata',
      titleEn: 'Correct Word Usage',
      descId: 'Pilih kalimat yang memakai kosakata target secara alami & benar, lengkap dengan koreksi.',
      descEn: 'Pick the sentence using the target word naturally, with fixes for wrong choices.',
      count: counts.usage,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <Link
        href="/quiz"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-primary font-semibold bg-surface px-3.5 py-2 rounded-full border border-border-color shadow-sm mb-4"
      >
        <ArrowLeft size={16} />
        {isId ? 'Kembali ke Hub Latihan' : 'Back to Practice Hub'}
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0">
          <Languages size={22} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
            {isId ? 'Kosakata Kontekstual' : 'Contextual Vocabulary'}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            {isId
              ? `${counts.all} soal format JLPT lengkap dengan pembahasan & koreksi kalimat`
              : `${counts.all} JLPT-style questions with detailed feedback & sentence fixes`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {modeCards.map((c) => (
          <button
            key={c.key}
            onClick={() => startSession(c.key)}
            className="group text-left bg-surface rounded-2xl border-2 border-border-color hover:border-primary p-5 transition-all hover:shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {c.badge}
                </span>
                <span className="text-xs font-semibold text-text-subtle flex items-center gap-1">
                  <Sparkles size={12} /> {c.count} {isId ? 'soal' : 'questions'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                {isId ? c.titleId : c.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                {isId ? c.descId : c.descEn}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
