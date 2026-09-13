import Link from 'next/link'
import { getSubLevels } from '@/lib/kanji'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { getSubLevelTitle } from '@/lib/categories'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const levelNum = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5

  let subLevels: number[] = []
  let error = false
  try {
    subLevels = await getSubLevels(levelNum)
  } catch {
    error = true
  }

  const session = await auth()
  let passedSubLevels = new Set<number>()

  if (session?.user?.id && !error) {
    const results = await prisma.quizResult.findMany({
      where: { userId: session.user.id, level: levelNum },
      select: { subLevel: true, score: true, total: true }
    })
    results.forEach(r => {
      if (r.total > 0 && (r.score / r.total) >= 0.8) {
        passedSubLevels.add(r.subLevel)
      }
    })
  }

  return (
    <div className="px-4 py-6">
      <Link href="/learn" className="flex items-center gap-2 text-sm text-text-muted mb-6 hover:text-primary">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 className="text-2xl font-bold text-text-main mb-1">N{level} — Kanji</h1>
      <p className="text-sm text-text-muted mb-6">Pilih kategori untuk mulai belajar</p>

      {error ? (
        <p className="text-center text-text-muted/80 py-12">
          Data N{level} belum tersedia. Jalankan npm run seed:kanji terlebih dahulu.
        </p>
      ) : (
        <div className="space-y-3">
          {subLevels.map((sl) => {
            const isPassed = passedSubLevels.has(sl)
            return (
              <Link
                key={sl}
                href={`/learn/${level}/${sl}`}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isPassed 
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-500' 
                    : 'bg-surface border-border-color hover:shadow-md hover:border-primary'
                }`}
              >
                <div>
                  <p className="font-semibold text-text-main flex items-center gap-2">
                    {getSubLevelTitle(levelNum, sl)}
                    {isPassed && <CheckCircle2 size={16} className="text-green-500" />}
                  </p>
                  <p className={`text-sm ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-text-muted'}`}>
                    {isPassed ? 'Tuntas' : 'Mulai belajar'}
                  </p>
                </div>
                <span className={isPassed ? 'text-green-500 text-xl' : 'text-primary text-xl'}>›</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
