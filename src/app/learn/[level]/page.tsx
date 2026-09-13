import Link from 'next/link'
import { getSubLevels } from '@/lib/kanji'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { getSubLevelTitle } from '@/lib/categories'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const levelNum = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5

  const titles: Record<number, string> = { 5: 'Pemula', 4: 'Dasar', 3: 'Menengah', 2: 'Lanjutan', 1: 'Mahir' }

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
    <div className="py-2 pb-10">
      <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-text-muted mb-8 hover:text-primary transition-colors font-medium bg-surface px-4 py-2 rounded-full border border-border-color shadow-sm">
        <ArrowLeft size={16} /> Kembali
      </Link>
      
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-8xl font-serif text-primary opacity-20 mb-[-40px] select-none" style={{ fontFamily: "'Noto Serif JP', serif" }}>漢字</span>
        <h1 className="text-3xl md:text-4xl font-bold text-text-main relative z-10">N{level} — {titles[levelNum]}</h1>
        <p className="text-text-muted mt-3 font-medium">Pilih kategori untuk mulai belajar</p>
      </div>

      {error ? (
        <div className="bg-surface border border-border-color rounded-2xl p-8 text-center max-w-lg mx-auto">
          <p className="text-text-muted font-medium">
            Data N{level} belum tersedia. Jalankan <code className="bg-card-muted px-2 py-1 rounded text-primary">npm run seed:kanji</code> terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {subLevels.map((sl) => {
            const isPassed = passedSubLevels.has(sl)
            return (
              <Link
                key={sl}
                href={`/learn/${level}/${sl}`}
                className={`group flex items-center justify-between p-5 md:p-6 rounded-3xl border transition-all duration-300 ${
                  isPassed 
                    ? 'bg-success/5 border-success/30 hover:border-success/60' 
                    : 'bg-surface border-border-color hover:shadow-md hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                    isPassed ? 'border-success text-success bg-success/10' : 'border-border-color text-text-muted group-hover:border-primary group-hover:text-primary transition-colors'
                  }`}>
                    {sl}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-primary transition-colors">
                      {getSubLevelTitle(levelNum, sl)}
                    </h3>
                    <p className={`text-sm font-medium ${isPassed ? 'text-success' : 'text-text-muted'}`}>
                      {isPassed ? 'Sudah Dikuasai' : 'Mulai Belajar'}
                    </p>
                  </div>
                </div>
                
                <div className="pr-2">
                  {isPassed ? (
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface border border-border-color flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                      <span className="font-bold text-xl">&rarr;</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
