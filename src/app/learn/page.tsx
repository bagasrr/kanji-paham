import Link from 'next/link'
import { Lock } from 'lucide-react'

const LEVELS = [
  { level: 5, label: 'N5', description: 'Pemula — 79 Kanji Dasar', color: 'bg-green-500', locked: false },
  { level: 4, label: 'N4', description: 'Dasar — 166 Kanji', color: 'bg-blue-500', locked: false },
  { level: 3, label: 'N3', description: 'Menengah — 367 Kanji', color: 'bg-yellow-500', locked: false },
  { level: 2, label: 'N2', description: 'Lanjutan — 367 Kanji', color: 'bg-orange-500', locked: false },
  { level: 1, label: 'N1', description: 'Mahir — 1232 Kanji', color: 'bg-red-600', locked: false },
]

export default function LearnPage() {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-main">Belajar Kanji</h1>
        <p className="text-sm text-text-muted mt-1">Pilih level JLPT untuk mulai belajar</p>
      </div>
      <div className="space-y-3">
        {LEVELS.map(({ level, label, description, color, locked }) => (
          <div key={level}>
            {locked ? (
              <div className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border-color bg-surface opacity-60 cursor-not-allowed">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {label}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-main">{label}</p>
                  <p className="text-sm text-text-muted">{description}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 rounded-full px-2.5 py-1">
                  <Lock size={12} className="text-text-muted/80" />
                  <span className="text-xs text-text-muted/80 font-medium">Soon</span>
                </div>
              </div>
            ) : (
              <Link
                href={`/learn/${level}`}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border-color bg-surface hover:shadow-md hover:border-primary transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {label}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-main">{label}</p>
                  <p className="text-sm text-text-muted">{description}</p>
                </div>
                <span className="text-primary text-xl">›</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
