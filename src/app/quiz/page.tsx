'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'

type JLPTQuestion = {
  prompt: string
  options: string[]
  correctIndex: number
  word: string
  meaning: string
}

export default function GlobalQuizPage() {
  const { lang } = useLanguage()
  const [level, setLevel] = useState<number | null>(null)
  const [questions, setQuestions] = useState<JLPTQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<'unanswered' | 'correct' | 'wrong'>('unanswered')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

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
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true)
      } else {
        setIdx((i) => i + 1)
        setSelected(null)
        setAnswerState('unanswered')
      }
    }, 1500)
  }

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-muted">Menyiapkan soal ujian...</p>
      </div>
    )
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 70 ? '🎉' : '📚'}</div>
        <h2 className="text-2xl font-bold text-text-main mb-2">Simulasi JLPT Selesai</h2>
        <p className="text-5xl font-bold text-primary my-4">{score} / {questions.length}</p>
        <p className="text-text-muted mb-8">Kamu menjawab benar {pct}% soal.</p>
        
        <div className="space-y-3">
          <button
            onClick={() => startQuiz(level!)}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          >
            <RotateCcw size={18} /> Ulangi Simulasi N{level}
          </button>
          <button
            onClick={() => {
              setLevel(null)
              setDone(false)
            }}
            className="w-full py-3 rounded-xl border border-border-color text-text-main font-semibold hover:bg-surface transition-colors"
          >
            Ganti Level
          </button>
        </div>
      </div>
    )
  }

  if (questions.length > 0 && questions[idx]) {
    const q = questions[idx]
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setLevel(null)} className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-text-muted">
            Soal {idx + 1} dari {questions.length}
          </span>
        </div>
        
        <div className="h-1.5 bg-surface rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-surface rounded-2xl border border-border-color p-6 mb-8 text-center min-h-[160px] flex flex-col items-center justify-center">
          <p className="text-lg md:text-xl text-text-main whitespace-pre-line font-medium leading-relaxed">
            {q.prompt}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options.map((option, i) => {
            let btnClass = 'border-border-color text-text-main hover:border-primary'
            if (selected !== null) {
              if (i === q.correctIndex)
                btnClass = 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
              else if (i === selected && answerState === 'wrong')
                btnClass = 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
              else 
                btnClass = 'border-border-color opacity-50'
            }
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                disabled={answerState !== 'unanswered'}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${btnClass} transition-colors text-left disabled:cursor-default`}
              >
                <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {OPTION_LABELS[i]}
                </span>
                <span className="text-lg font-medium">{option}</span>
              </button>
            )
          })}
        </div>
        
        {selected !== null && (
          <div className="mt-8 p-4 rounded-xl bg-surface border border-border-color animate-fade-in text-center">
            <p className="text-sm text-text-muted font-medium mb-1">Arti Kosakata:</p>
            <p className="text-lg text-text-main font-semibold">
              {q.word} = {q.meaning}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Initial State: Level Selection
  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Simulasi Ujian JLPT</h1>
        <p className="text-text-muted">
          Pilih level JLPT. Sistem akan mengacak soal kosakata mirip dengan soal aslinya, menanyakan cara baca atau bentuk kanji dari suatu kata.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[5, 4, 3, 2, 1].map((lvl) => (
          <button
            key={lvl}
            onClick={() => startQuiz(lvl)}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-border-color bg-surface hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-text-main group-hover:text-primary transition-colors">
                N{lvl}
              </span>
            </div>
            <span className="font-semibold text-text-muted group-hover:text-text-main transition-colors">
              Mulai Simulasi
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
