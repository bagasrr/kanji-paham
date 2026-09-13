'use client'

import { useState } from 'react'
import { ArrowLeft, RotateCcw, Zap, BookOpen, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

type JLPTQuestion = {
  prompt: string
  options: string[]
  correctIndex: number
  word: string
  meaning: string
  meaning_id?: string
  meaning_en?: string
}

type AnswerState = 'unanswered' | 'correct' | 'wrong'

const LEVEL_DATA = [
  {
    level: 5, label: 'N5', title: 'Pemula', titleEn: 'Beginner',
    subtitle: '79 kanji dasar', subtitleEn: '79 basic kanji',
    emoji: '🌱',
    color: 'text-success',
    badge: 'bg-success/15 text-success',
    accentBg: 'bg-success',
  },
  {
    level: 4, label: 'N4', title: 'Dasar', titleEn: 'Elementary',
    subtitle: '166 kanji sehari-hari', subtitleEn: '166 everyday kanji',
    emoji: '🌿',
    color: 'text-secondary',
    badge: 'bg-secondary/15 text-secondary',
    accentBg: 'bg-secondary',
  },
  {
    level: 3, label: 'N3', title: 'Menengah', titleEn: 'Intermediate',
    subtitle: '367 kanji teks umum', subtitleEn: '367 general kanji',
    emoji: '🌸',
    color: 'text-warning',
    badge: 'bg-warning/15 text-warning',
    accentBg: 'bg-warning',
  },
  {
    level: 2, label: 'N2', title: 'Lanjutan', titleEn: 'Advanced',
    subtitle: '367 kanji bacaan luas', subtitleEn: '367 broad reading kanji',
    emoji: '🏯',
    color: 'text-sakura',
    badge: 'bg-sakura/15 text-sakura',
    accentBg: 'bg-sakura',
  },
  {
    level: 1, label: 'N1', title: 'Mahir', titleEn: 'Expert',
    subtitle: '1232 kanji tingkat lanjut', subtitleEn: '1232 advanced kanji',
    emoji: '⛩️',
    color: 'text-primary',
    badge: 'bg-primary/15 text-primary',
    accentBg: 'bg-primary',
  },
]

// Detect if an option looks like a kanji character (≤4 chars, CJK)
function isKanji(text: string): boolean {
  return text.length <= 4 && /[\u4e00-\u9fff\u3040-\u30ff]/.test(text)
}

export default function GlobalQuizPage() {
  const { lang } = useLanguage()
  const [level, setLevel] = useState<number | null>(null)
  const [questions, setQuestions] = useState<JLPTQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [showNext, setShowNext] = useState(false)

  async function startQuiz(selectedLevel: number) {
    setLevel(selectedLevel)
    setLoading(true)
    const res = await fetch(`/api/quiz/jlpt?level=${selectedLevel}&lang=${lang}`)
    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
      setIdx(0)
      setSelected(null)
      setAnswerState('unanswered')
      setScore(0)
      setDone(false)
      setShowNext(false)
    }
    setLoading(false)
  }

  function selectAnswer(optionIdx: number) {
    if (answerState !== 'unanswered') return
    const q = questions[idx]
    const correct = optionIdx === q.correctIndex
    setSelected(optionIdx)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 1)
    setShowNext(true)
  }

  function goNext() {
    if (idx + 1 >= questions.length) {
      setDone(true)
    } else {
      setIdx((i) => i + 1)
      setSelected(null)
      setAnswerState('unanswered')
      setShowNext(false)
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-border-color rounded-full" />
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <div className="text-center">
          <p className="text-text-main font-semibold mb-1">
            {lang === 'id' ? 'Menyiapkan soal...' : 'Preparing questions...'}
          </p>
          <p className="text-text-muted text-sm">
            {lang === 'id' ? 'Mengacak pertanyaan untuk kamu' : 'Shuffling questions for you'}
          </p>
        </div>
      </div>
    )
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const isGreat = pct >= 80
    const isOk = pct >= 50
    const currentLevel = LEVEL_DATA.find(l => l.level === level)

    return (
      <div className="py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Sakura decoration */}
          <div className="text-center mb-2 text-4xl opacity-30 select-none">🌸 🌸 🌸</div>

          <div className="bg-surface rounded-3xl border border-border-color p-8 text-center shadow-sm mb-6">
            {/* Trophy */}
            <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 3 }}>
              {isGreat ? '🏆' : isOk ? '👏' : '📚'}
            </div>

            <h2 className="text-2xl font-bold text-text-main mb-1">
              {isGreat
                ? (lang === 'id' ? 'Luar Biasa!' : 'Awesome!')
                : isOk
                ? (lang === 'id' ? 'Bagus sekali!' : 'Well done!')
                : (lang === 'id' ? 'Terus berlatih!' : 'Keep practicing!')}
            </h2>
            <p className="text-text-muted mb-6 text-sm">
              {lang === 'id'
                ? `Simulasi N${level} · ${currentLevel?.title}`
                : `Simulation N${level} · ${currentLevel?.titleEn || currentLevel?.title}`}
            </p>

            {/* Score circle */}
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-card-muted stroke-current"
                  strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"
                />
                <circle
                  className={`${isGreat ? 'text-success' : isOk ? 'text-warning' : 'text-primary'} stroke-current`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50" cy="50" r="40" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * pct) / 100}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-main">{pct}%</span>
                <span className="text-xs text-text-muted">{lang === 'id' ? 'Benar' : 'Correct'}</span>
              </div>
            </div>

            <p className="text-lg font-semibold text-text-main">
              {lang === 'id'
                ? `${score} dari ${questions.length} soal benar`
                : `${score} of ${questions.length} questions correct`}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => startQuiz(level!)}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98]"
            >
              <RotateCcw size={18} /> {lang === 'id' ? `Ulangi N${level}` : `Retry N${level}`}
            </button>
            <button
              onClick={() => { setLevel(null); setDone(false) }}
              className="w-full py-4 rounded-2xl border-2 border-border-color bg-surface text-text-main font-semibold text-base hover:border-primary/40 transition-colors active:scale-[0.98]"
            >
              {lang === 'id' ? 'Pilih Level Lain' : 'Choose Another Level'}
            </button>
          </div>

          <div className="text-center mt-6 text-3xl opacity-20 select-none">✿ ✿ ✿</div>
        </div>
      </div>
    )
  }

  // ── Active Quiz ──────────────────────────────────────────────────────────────
  if (questions.length > 0 && questions[idx]) {
    const q = questions[idx]
    const progressPct = (idx / questions.length) * 100
    const optionsAreKanji = q.options.every(o => isKanji(o))

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setLevel(null)}
            className="w-10 h-10 rounded-full border border-border-color bg-surface flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm flex-shrink-0"
            aria-label={lang === 'id' ? 'Keluar dari quiz' : 'Exit quiz'}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                {lang === 'id' ? `Simulasi N${level}` : `N${level} Simulation`}
              </span>
              <span className="text-xs font-semibold text-text-muted">
                <span className="text-text-main font-bold">{idx + 1}</span> / {questions.length}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-card-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-surface rounded-3xl border border-border-color p-6 md:p-10 mb-6 text-center shadow-sm min-h-[160px] flex flex-col items-center justify-center">
          <p
            className="text-xl md:text-2xl font-bold text-text-main leading-relaxed"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {q.prompt}
          </p>
        </div>

        {/* Answer Grid */}
        <div className={`grid gap-3 ${optionsAreKanji ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {q.options.map((option, i) => {
            const isCorrect = i === q.correctIndex
            const isSelected = i === selected
            const isWrong = isSelected && answerState === 'wrong'

            let stateClass = 'border-border-color bg-surface text-text-main hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5'
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
                onClick={() => selectAnswer(i)}
                disabled={answerState !== 'unanswered'}
                aria-label={`${lang === 'id' ? 'Pilihan' : 'Option'} ${['A','B','C','D'][i]}: ${option}`}
                className={`
                  relative border-2 rounded-2xl transition-all duration-200 text-left
                  disabled:cursor-default active:scale-[0.98]
                  ${stateClass}
                  ${optionsAreKanji ? 'flex flex-col items-center justify-center py-6 px-4 min-h-[100px]' : 'flex items-center gap-4 p-4'}
                `}
              >
                {/* Option label badge */}
                <span className={`
                  flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${selected === null ? 'bg-card-muted text-text-muted' :
                    isCorrect ? 'bg-success text-white' :
                    isWrong ? 'bg-error text-white' :
                    'bg-card-muted text-text-subtle'}
                  ${optionsAreKanji ? 'absolute top-2 left-2 w-6 h-6 text-[10px]' : ''}
                `}>
                  {selected !== null && isCorrect ? '✓' : selected !== null && isWrong ? '✕' : ['A','B','C','D'][i]}
                </span>

                <span
                  className={`font-semibold leading-snug ${optionsAreKanji ? 'text-5xl mt-1' : 'text-base md:text-lg'}`}
                  style={optionsAreKanji ? { fontFamily: "'Noto Serif JP', serif" } : undefined}
                >
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feedback + Next */}
        {showNext && (
          <div className="mt-6">
            {/* Feedback panel */}
            <div className={`
              p-4 rounded-2xl mb-4 border-2
              ${answerState === 'correct'
                ? 'bg-success/15 border-success/30'
                : 'bg-error/15 border-error/30'
              }
            `}>
              <p className={`font-bold mb-1 flex items-center gap-2 ${answerState === 'correct' ? 'text-success' : 'text-error'}`}>
                {answerState === 'correct' 
                  ? (lang === 'id' ? '✓ Benar!' : '✓ Correct!') 
                  : (lang === 'id' ? '✕ Kurang tepat' : '✕ Not quite right')}
              </p>
              <p className="text-sm text-text-muted">
                <span className="font-semibold text-text-main">{q.word}</span>{' '}
                {lang === 'id' ? 'berarti' : 'means'}{' '}
                <span className="font-semibold text-text-main">
                  {lang === 'id' ? (q.meaning_id || q.meaning) : (q.meaning_en || q.meaning)}
                </span>
              </p>
            </div>

            {/* Next CTA */}
            <button
              onClick={goNext}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98]"
            >
              {idx + 1 >= questions.length 
                ? (lang === 'id' ? 'Lihat Hasil 🏆' : 'View Results 🏆') 
                : (lang === 'id' ? 'Soal Berikutnya' : 'Next Question')}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Level Selection (Hub) ────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
            <BookOpen size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-main">
              {lang === 'id' ? 'Simulasi Ujian JLPT' : 'JLPT Exam Simulation'}
            </h1>
            <p className="text-text-muted text-sm font-medium">
              {lang === 'id'
                ? 'Uji kemampuan kosakatamu sebelum ujian asli'
                : 'Test your vocabulary before the real exam'}
            </p>
          </div>
        </div>

        {/* Motivational banner */}
        <div className="mt-4 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <p className="text-sm text-text-main font-medium">
            {lang === 'id'
              ? 'Latihan sedikit hari ini, biar besok makin paham.'
              : 'A little daily practice makes mastery effortless.'}
          </p>
        </div>
      </div>

      {/* Mode info */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-surface border border-border-color rounded-full px-3 py-1.5 shadow-sm">
          <Zap size={13} className="text-warning" />
          <span className="text-xs font-semibold text-text-main">
            {lang === 'id' ? 'Soal Acak' : 'Randomized'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-surface border border-border-color rounded-full px-3 py-1.5 shadow-sm">
          <span className="text-xs">🕐</span>
          <span className="text-xs font-semibold text-text-main">
            {lang === 'id' ? '~5 Menit' : '~5 Mins'}
          </span>
        </div>
      </div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEVEL_DATA.map(({ level, label, title, titleEn, subtitle, subtitleEn, emoji, badge, accentBg }) => (
          <button
            key={level}
            onClick={() => startQuiz(level)}
            className="group relative overflow-hidden rounded-2xl border-2 border-border-color bg-surface p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
          >
            {/* Decorative corner */}
            <div
              className="absolute top-0 right-0 text-5xl opacity-10 leading-none -mt-1 -mr-2 select-none pointer-events-none group-hover:opacity-20 transition-opacity"
              aria-hidden
            >
              {emoji}
            </div>

            {/* Level badge */}
            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold mb-3 ${badge}`}>
              {label}
            </span>

            <h3 className="text-base font-bold text-text-main mb-0.5">
              {lang === 'id' ? title : titleEn}
            </h3>
            <p className="text-xs text-text-muted mb-4">
              {lang === 'id' ? subtitle : subtitleEn}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted group-hover:text-text-main transition-colors">
                {lang === 'id' ? 'Mulai Ujian' : 'Start Exam'}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 ${accentBg}`}
              >
                <ChevronRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs text-text-subtle mt-8">
        {lang === 'id'
          ? 'Soal diacak dari kosakata JLPT yang sering muncul di ujian asli'
          : 'Questions are randomized from frequent JLPT vocabulary in real exams'}
      </p>
    </div>
  )
}
