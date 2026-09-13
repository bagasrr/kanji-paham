'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'
import type { KanjiEntry } from '@/lib/types'
import { buildFlashCards, buildMCQQuestions, type FlashCard, type MCQQuestion } from '@/lib/quiz'
import { useLanguage } from '@/components/LanguageProvider'

type Mode = 'select' | 'flashcard' | 'mcq'
type AnswerState = 'unanswered' | 'correct' | 'wrong'

export default function QuizPage() {
  const { level, subLevel } = useParams() as { level: string; subLevel: string }
  const router = useRouter()
  const { lang } = useLanguage()

  const [entries, setEntries] = useState<KanjiEntry[]>([])
  const [mode, setMode] = useState<Mode>('select')
  const [cards, setCards] = useState<FlashCard[]>([])
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/kanji?level=${level}&subLevel=${subLevel}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.kanji)
      }
    }
    load()
  }, [level, subLevel])

  const [mistakes, setMistakes] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showGuestModal, setShowGuestModal] = useState(false)

  function startFlashcard() {
    setCards(buildFlashCards(entries, lang))
    setIdx(0)
    setRevealed(false)
    setScore(0)
    setMistakes([])
    setDone(false)
    setMode('flashcard')
  }

  function startMCQ() {
    setQuestions(buildMCQQuestions(entries, lang))
    setIdx(0)
    setSelected(null)
    setAnswerState('unanswered')
    setScore(0)
    setMistakes([])
    setDone(false)
    setMode('mcq')
  }

  function nextCard(knew: boolean) {
    if (knew) {
      setScore((s) => s + 1)
    } else {
      setMistakes(prev => [...prev, cards[idx].character])
    }
    if (idx + 1 >= cards.length) {
      setDone(true)
    } else {
      setIdx((i) => i + 1)
      setRevealed(false)
    }
  }

  function selectMCQAnswer(optionIdx: number) {
    if (answerState !== 'unanswered') return
    const q = questions[idx]
    const correct = optionIdx === q.correctIndex
    setSelected(optionIdx)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) {
      setScore((s) => s + 1)
    } else {
      setMistakes(prev => [...prev, q.character])
    }
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true)
      } else {
        setIdx((i) => i + 1)
        setSelected(null)
        setAnswerState('unanswered')
      }
    }, 1000)
  }

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  async function saveProgress() {
    setSaveStatus('saving')
    const total = mode === 'flashcard' ? cards.length : questions.length
    const res = await fetch('/api/user/quiz-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        level: parseInt(level), 
        subLevel: parseInt(subLevel),
        mode,
        score,
        total,
        mistakes
      }),
    })
    
    if (res.status === 401) {
      setSaveStatus('error')
      setShowGuestModal(true)
    } else if (res.ok) {
      setSaveStatus('saved')
    } else {
      setSaveStatus('error')
    }
  }

  // ── Result Modal ───────────────────────────────────────────────────────────
  if (done) {
    const total = mode === 'flashcard' ? cards.length : questions.length
    const pct = Math.round((score / total) * 100)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-md bg-surface rounded-2xl p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{pct >= 70 ? '🎉' : '📚'}</div>
            <h2 className="text-xl font-bold text-text-main">Quiz Selesai!</h2>
            <p className="text-4xl font-bold text-primary mt-2">{score}/{total}</p>
            <p className="text-text-muted mt-1">{pct}% benar</p>
          </div>
          <div className="space-y-3">
            {saveStatus === 'saved' ? (
              <div className="w-full py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Progress Tersimpan
              </div>
            ) : (
              <button
                onClick={saveProgress}
                disabled={saveStatus === 'saving'}
                className="w-full py-3 rounded-xl bg-[#4F46E5] text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan Progress'}
              </button>
            )}
            <button
              onClick={() => (mode === 'flashcard' ? startFlashcard() : startMCQ())}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Ulangi Quiz
            </button>
            <Link
              href={`/learn/${level}/${subLevel}`}
              className="block w-full py-3 rounded-xl border border-border-color text-text-main font-medium text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Pelajaran
            </Link>
          </div>
        </div>

        {/* Guest Modal Overlay */}
        {showGuestModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] px-4">
            <div className="bg-surface rounded-2xl p-6 shadow-2xl max-w-sm w-full">
              <h3 className="text-lg font-bold text-text-main mb-2">Login Diperlukan</h3>
              <p className="text-text-muted dark:text-text-muted/80 mb-6 text-sm leading-relaxed">
                Kamu harus login untuk menyimpan progress belajar. Ingin login atau daftar sekarang?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border-color text-text-main font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <Link
                  href={`/auth/login?callbackUrl=/learn/${level}/${subLevel}/quiz`}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-center hover:bg-red-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Mode Select ────────────────────────────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className="px-4 py-6">
        <Link href={`/learn/${level}/${subLevel}`} className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <ArrowLeft size={16} /> Kembali ke Pelajaran
        </Link>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          Quiz N{level}
        </h1>
        <p className="text-text-muted mb-8">{entries.length} kanji · Pilih mode</p>

        <div className="space-y-4">
          <button
            onClick={startFlashcard}
            disabled={entries.length === 0}
            className="w-full p-5 rounded-2xl border-2 border-[#DC2626] text-left hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
          >
            <p className="font-bold text-primary text-lg">⚡ Flashcard Match</p>
            <p className="text-sm text-text-muted mt-1">Lihat Kanji, tebak artinya. Cepat dan efektif.</p>
          </button>
          <button
            onClick={startMCQ}
            disabled={entries.length === 0}
            className="w-full p-5 rounded-2xl border-2 border-[#4F46E5] text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors disabled:opacity-50"
          >
            <p className="font-bold text-[#4F46E5] text-lg">🧠 Multiple Choice</p>
            <p className="text-sm text-text-muted mt-1">4 pilihan, 1 jawaban benar. Tes bacaan & arti.</p>
          </button>
        </div>
      </div>
    )
  }

  // ── Flashcard Mode ─────────────────────────────────────────────────────────
  if (mode === 'flashcard' && cards[idx]) {
    const card = cards[idx]
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setMode('select')} className="text-text-muted/80">
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm text-text-muted">
            {idx + 1} / {cards.length}
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-8">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
          />
        </div>
        <div
          onClick={() => setRevealed(true)}
          className="w-full min-h-64 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-border-color bg-surface cursor-pointer hover:border-[#DC2626] transition-colors"
        >
          <span
            className="text-9xl font-serif text-text-main"
            style={{ fontFamily: 'serif' }}
          >
            {card.character}
          </span>
          {revealed ? (
            <p className="text-xl font-semibold text-primary">{card.answer}</p>
          ) : (
            <p className="text-sm text-text-muted/80">Ketuk untuk lihat arti</p>
          )}
        </div>
        {revealed && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => nextCard(false)}
              className="flex-1 py-3 rounded-xl border-2 border-red-200 dark:border-red-900 text-red-500 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <XCircle size={18} /> Belum Tahu
            </button>
            <button
              onClick={() => nextCard(true)}
              className="flex-1 py-3 rounded-xl border-2 border-green-200 dark:border-green-900 text-green-600 font-semibold flex items-center justify-center gap-2 hover:bg-green-50 dark:hover:bg-green-950/20"
            >
              <CheckCircle2 size={18} /> Tahu!
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── MCQ Mode ───────────────────────────────────────────────────────────────
  if (mode === 'mcq' && questions[idx]) {
    const q = questions[idx]
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setMode('select')} className="text-text-muted/80">
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm text-text-muted">
            {idx + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6">
          <div
            className="h-full bg-[#4F46E5] rounded-full transition-all"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="text-center mb-8">
          <span
            className="text-8xl font-serif text-text-main"
            style={{ fontFamily: 'serif' }}
          >
            {q.character}
          </span>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{q.prompt}</p>
        </div>
        <div className="space-y-3">
          {q.options.map((option, i) => {
            let btnClass =
              'border-border-color text-text-main'
            if (selected !== null) {
              if (i === q.correctIndex)
                btnClass =
                  'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
              else if (i === selected && answerState === 'wrong')
                btnClass =
                  'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            }
            return (
              <button
                key={i}
                onClick={() => selectMCQAnswer(i)}
                disabled={answerState !== 'unanswered'}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 ${btnClass} hover:border-[#4F46E5] disabled:cursor-default transition-colors text-left`}
              >
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {OPTION_LABELS[i]}
                </span>
                <span className="text-base">{option}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-text-muted/80">Memuat...</p>
    </div>
  )
}
