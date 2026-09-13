'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, ChevronRight, Zap, Brain } from 'lucide-react'
import type { KanjiEntry } from '@/lib/types'
import { buildFlashCards, buildMCQQuestions, type FlashCard, type MCQQuestion } from '@/lib/quiz'
import { useLanguage } from '@/components/LanguageProvider'

type Mode = 'select' | 'flashcard' | 'mcq'
type AnswerState = 'unanswered' | 'correct' | 'wrong'

// Detect if text is primarily kanji/kana (for large display)
function isKanjiLike(text: string): boolean {
  return text.length <= 4 && /[\u4e00-\u9fff\u3040-\u30ff]/.test(text)
}

// ──────────────────────────────────────────────────────────────
// SHARED: Progress Header
// ──────────────────────────────────────────────────────────────
function QuizHeader({
  level, subLevel, current, total, onBack, mode
}: {
  level: string, subLevel: string, current: number, total: number,
  onBack: () => void, mode: string
}) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full border border-border-color bg-surface flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm flex-shrink-0"
        aria-label="Kembali"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted truncate">
            N{level} · {mode === 'flashcard' ? 'Flashcard' : 'Pilihan Ganda'}
          </span>
          <span className="text-xs font-semibold text-text-muted flex-shrink-0 ml-2">
            <span className="text-text-main font-bold">{current}</span>/{total}
          </span>
        </div>
        <div className="h-2 bg-card-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${mode === 'flashcard' ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { level, subLevel } = useParams() as { level: string; subLevel: string }
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
  const [mistakes, setMistakes] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [showMCQNext, setShowMCQNext] = useState(false)

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

  function startFlashcard() {
    setCards(buildFlashCards(entries, lang))
    setIdx(0); setRevealed(false); setScore(0)
    setMistakes([]); setDone(false); setMode('flashcard')
  }

  function startMCQ() {
    setQuestions(buildMCQQuestions(entries, lang))
    setIdx(0); setSelected(null); setAnswerState('unanswered')
    setScore(0); setMistakes([]); setDone(false)
    setShowMCQNext(false); setMode('mcq')
  }

  function nextCard(knew: boolean) {
    if (!knew) setMistakes(prev => [...prev, cards[idx].character])
    else setScore(s => s + 1)
    if (idx + 1 >= cards.length) { setDone(true) }
    else { setIdx(i => i + 1); setRevealed(false) }
  }

  function selectMCQAnswer(optionIdx: number) {
    if (answerState !== 'unanswered') return
    const q = questions[idx]
    const correct = optionIdx === q.correctIndex
    setSelected(optionIdx)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
    else setMistakes(prev => [...prev, q.character])
    setShowMCQNext(true)
  }

  function goMCQNext() {
    if (idx + 1 >= questions.length) { setDone(true) }
    else {
      setIdx(i => i + 1); setSelected(null)
      setAnswerState('unanswered'); setShowMCQNext(false)
    }
  }

  async function saveProgress() {
    setSaveStatus('saving')
    const total = mode === 'flashcard' ? cards.length : questions.length
    const res = await fetch('/api/user/quiz-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: parseInt(level), subLevel: parseInt(subLevel), mode, score, total, mistakes }),
    })
    if (res.status === 401) { setSaveStatus('error'); setShowGuestModal(true) }
    else if (res.ok) { setSaveStatus('saved') }
    else { setSaveStatus('error') }
  }

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  // ── Results ─────────────────────────────────────────────────
  if (done) {
    const total = mode === 'flashcard' ? cards.length : questions.length
    const pct = Math.round((score / total) * 100)
    const isGreat = pct >= 80
    const isOk = pct >= 50

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-border-color">
          {/* Top accent */}
          <div className={`h-1.5 w-full ${isGreat ? 'bg-success' : isOk ? 'bg-warning' : 'bg-primary'}`} />

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{isGreat ? '🏆' : isOk ? '👏' : '📚'}</div>
              <h2 className="text-xl font-bold text-text-main mb-1">Quiz Selesai!</h2>

              {/* Score row */}
              <div className="flex items-baseline justify-center gap-2 my-3">
                <span className="text-5xl font-bold text-text-main">{score}</span>
                <span className="text-xl text-text-subtle">/ {total}</span>
              </div>

              {/* Pct bar */}
              <div className="relative h-3 bg-card-muted rounded-full overflow-hidden mx-4 mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isGreat ? 'bg-success' : isOk ? 'bg-warning' : 'bg-primary'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-text-muted">{pct}% benar</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {saveStatus === 'saved' ? (
                <div className="w-full py-3 rounded-2xl bg-success/15 text-success font-semibold text-center flex items-center justify-center gap-2 text-sm border border-success/30">
                  <CheckCircle2 size={16} /> Progress Tersimpan ✓
                </div>
              ) : (
                <button
                  onClick={saveProgress}
                  disabled={saveStatus === 'saving'}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary-hover transition-colors"
                >
                  {saveStatus === 'saving' ? 'Menyimpan...' : '💾 Simpan Progress'}
                </button>
              )}
              <button
                onClick={() => mode === 'flashcard' ? startFlashcard() : startMCQ()}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors active:scale-[0.98]"
              >
                <RotateCcw size={15} /> Ulangi Quiz
              </button>
              <Link
                href={`/learn/${level}/${subLevel}`}
                className="block w-full py-3.5 rounded-2xl border-2 border-border-color bg-surface text-text-main font-semibold text-sm text-center hover:border-primary/40 transition-colors"
              >
                Kembali ke Pelajaran
              </Link>
            </div>
          </div>
        </div>

        {/* Guest Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] px-4">
            <div className="bg-surface rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-border-color">
              <div className="text-3xl mb-3 text-center">🔒</div>
              <h3 className="text-base font-bold text-text-main mb-2 text-center">Login Diperlukan</h3>
              <p className="text-text-muted mb-5 text-sm text-center leading-relaxed">
                Masuk untuk menyimpan progress belajar dan melacak perkembanganmu.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border-color bg-surface text-text-main font-medium text-sm hover:bg-card-muted transition-colors"
                >
                  Batal
                </button>
                <Link
                  href={`/auth/login?callbackUrl=/learn/${level}/${subLevel}/quiz`}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm text-center hover:bg-primary-hover transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Mode Select ──────────────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-32">
        {/* Back */}
        <Link
          href={`/learn/${level}/${subLevel}`}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Kembali ke Pelajaran
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-main mb-1">
            Quiz N{level}
          </h1>
          <p className="text-text-muted text-sm">
            {entries.length} kanji · Pilih mode latihanmu
          </p>
        </div>

        {/* Mode Cards */}
        <div className="space-y-4 mb-8">
          {/* Flashcard */}
          <button
            onClick={startFlashcard}
            disabled={entries.length === 0}
            className="w-full group relative overflow-hidden bg-surface border-2 border-border-color rounded-2xl p-5 text-left hover:border-warning hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/15 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap size={22} className="text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-main text-base">Flashcard</h3>
                  <span className="text-xs bg-warning/15 text-warning font-semibold px-2 py-0.5 rounded-full">Cepat</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  Lihat kanji, tebak artinya. Evaluasi sendiri — tahu atau belum tahu.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-text-muted font-medium">✓ Efektif untuk review cepat</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-text-subtle group-hover:text-warning transition-colors flex-shrink-0 mt-0.5" />
            </div>
          </button>

          {/* MCQ */}
          <button
            onClick={startMCQ}
            disabled={entries.length === 0}
            className="w-full group relative overflow-hidden bg-surface border-2 border-border-color rounded-2xl p-5 text-left hover:border-primary hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Brain size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-main text-base">Pilihan Ganda</h3>
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">Populer</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  4 pilihan, 1 jawaban benar. Tes arti, bacaan on&apos;yomi &amp; kun&apos;yomi, dan kebalikannya.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-text-muted font-medium">✓ 5 variasi soal berbeda</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-text-subtle group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            </div>
          </button>
        </div>

        {/* Kanji count info */}
        {entries.length > 0 && (
          <div className="text-center">
            <p className="text-xs text-text-subtle">
              {entries.length} kanji siap untuk latihan
            </p>
          </div>
        )}
        {entries.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-text-muted text-sm">Memuat data kanji...</p>
          </div>
        )}
      </div>
    )
  }

  // ── Flashcard Mode ───────────────────────────────────────────
  if (mode === 'flashcard' && cards[idx]) {
    const card = cards[idx]
    return (
      <div className="max-w-xl mx-auto px-4 py-6 pb-32">
        <QuizHeader
          level={level} subLevel={subLevel}
          current={idx + 1} total={cards.length}
          onBack={() => setMode('select')} mode="flashcard"
        />

        {/* Flashcard */}
        <div
          onClick={() => !revealed && setRevealed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !revealed && setRevealed(true)}
          className={`
            w-full flex flex-col items-center justify-center gap-5 p-8 rounded-3xl
            border-2 transition-all duration-300 mb-6 cursor-pointer
            min-h-[280px] select-none relative overflow-hidden bg-surface
            ${revealed
              ? 'border-warning shadow-md'
              : 'border-border-color hover:border-warning/60 hover:shadow-md'
            }
          `}
        >
          {/* Subtle decorative character in bg */}
          <div className="absolute text-[8rem] font-serif opacity-[0.04] pointer-events-none select-none text-text-main" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            {card.character}
          </div>

          <span
            className="text-8xl md:text-9xl font-serif text-text-main leading-none relative z-10"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {card.character}
          </span>

          {revealed ? (
            <div className="text-center relative z-10">
              <p className="text-xl font-bold text-warning capitalize">{card.answer}</p>
              <p className="text-xs text-text-muted mt-1">Kamu tahu kanji ini?</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-text-muted relative z-10">
              <span>Ketuk untuk melihat arti</span>
            </div>
          )}
        </div>

        {/* Flashcard Actions */}
        {revealed ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => nextCard(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-error/30 bg-error/10 text-error font-bold text-sm hover:bg-error/20 transition-colors active:scale-[0.98]"
            >
              <XCircle size={18} />
              Belum Tahu
            </button>
            <button
              onClick={() => nextCard(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-success/30 bg-success/10 text-success font-bold text-sm hover:bg-success/20 transition-colors active:scale-[0.98]"
            >
              <CheckCircle2 size={18} />
              Tahu!
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setRevealed(true)}
              className="px-8 py-3.5 rounded-2xl bg-warning text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md active:scale-[0.98]"
            >
              Lihat Arti
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── MCQ Mode ────────────────────────────────────────────────
  if (mode === 'mcq' && questions[idx]) {
    const q = questions[idx]
    const optionsAreKanji = q.options.every(o => isKanjiLike(o))

    return (
      <div className="max-w-xl mx-auto px-4 py-6 pb-32">
        <QuizHeader
          level={level} subLevel={subLevel}
          current={idx + 1} total={questions.length}
          onBack={() => setMode('select')} mode="mcq"
        />

        {/* Question area */}
        <div className="bg-surface rounded-3xl border border-border-color p-6 md:p-8 mb-5 text-center shadow-sm">
          {/* Kanji hero (for reverse questions showing "?") */}
          {q.character && (
            <div
              className="text-7xl md:text-8xl font-serif text-text-main leading-none mb-4"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              {q.character}
            </div>
          )}
          <p className="text-base md:text-lg font-semibold text-text-main leading-relaxed">
            {q.prompt}
          </p>
        </div>

        {/* Options grid */}
        <div className={`grid gap-3 mb-5 ${optionsAreKanji ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {q.options.map((option, i) => {
            const isCorrect = i === q.correctIndex
            const isSelected = i === selected
            const isWrong = isSelected && answerState === 'wrong'

            let stateClass = 'border-border-color bg-surface text-text-main hover:border-primary/60 hover:shadow-sm hover:-translate-y-0.5'
            if (selected !== null) {
              if (isCorrect)
                stateClass = 'border-success bg-success/15 text-success font-bold'
              else if (isWrong)
                stateClass = 'border-error bg-error/15 text-error font-bold'
              else
                stateClass = 'border-border-color bg-card-muted/50 text-text-subtle opacity-60'
            }

            return (
              <button
                key={i}
                onClick={() => selectMCQAnswer(i)}
                disabled={answerState !== 'unanswered'}
                aria-label={`Pilihan ${OPTION_LABELS[i]}: ${option}`}
                className={`
                  relative border-2 rounded-2xl transition-all duration-200
                  disabled:cursor-default active:scale-[0.98]
                  ${stateClass}
                  ${optionsAreKanji
                    ? 'flex flex-col items-center justify-center py-5 px-3 min-h-[90px]'
                    : 'flex items-center gap-3 p-4'
                  }
                `}
              >
                {/* Label badge */}
                <span className={`
                  ${optionsAreKanji ? 'absolute top-1.5 left-2 w-5 h-5 text-[10px]' : 'flex-shrink-0 w-8 h-8 text-xs'}
                  rounded-full flex items-center justify-center font-bold
                  ${selected === null ? 'bg-card-muted text-text-muted'
                    : isCorrect ? 'bg-success text-white'
                    : isWrong ? 'bg-error text-white'
                    : 'bg-card-muted text-text-subtle'
                  }
                `}>
                  {selected !== null && isCorrect ? '✓'
                    : selected !== null && isWrong ? '✕'
                    : OPTION_LABELS[i]
                  }
                </span>

                <span
                  className={`font-semibold leading-snug ${optionsAreKanji ? 'text-4xl' : 'text-base'}`}
                  style={optionsAreKanji ? { fontFamily: "'Noto Serif JP', serif" } : undefined}
                >
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feedback + next */}
        {showMCQNext && (
          <div>
            <div className={`
              p-4 rounded-2xl mb-3 border-2
              ${answerState === 'correct'
                ? 'bg-success/15 border-success/30'
                : 'bg-error/15 border-error/30'
              }
            `}>
              <p className={`font-bold text-sm mb-0.5 ${answerState === 'correct' ? 'text-success' : 'text-error'}`}>
                {answerState === 'correct' ? '✓ Benar!' : '✕ Kurang tepat'}
              </p>
              <p className="text-sm text-text-muted">
                Jawaban benar:{' '}
                <span
                  className="font-bold text-text-main"
                  style={isKanjiLike(q.options[q.correctIndex]) ? { fontFamily: "'Noto Serif JP', serif" } : undefined}
                >
                  {q.options[q.correctIndex]}
                </span>
              </p>
            </div>

            <button
              onClick={goMCQNext}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98]"
            >
              {idx + 1 >= questions.length ? 'Lihat Hasil 🏆' : 'Soal Berikutnya'}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // Loading / fallback
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-border-color border-t-primary rounded-full animate-spin" />
      <p className="text-text-muted text-sm">Memuat quiz...</p>
    </div>
  )
}
