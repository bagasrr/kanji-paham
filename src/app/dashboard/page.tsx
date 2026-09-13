import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await auth()
  
  const totalKanji = await prisma.kanji.count()
  const totalQuestions = await prisma.customQuestion.count()
  const pendingApps = session?.user?.role === 'ADMIN' 
    ? await prisma.teacherApplication.count({ where: { status: 'PENDING' } })
    : 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Total Kanji di Database</h3>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{totalKanji}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Total Soal Kustom</h3>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{totalQuestions}</p>
        </div>
        {session?.user?.role === 'ADMIN' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Pengajuan Sensei (Pending)</h3>
            <p className="text-4xl font-bold text-orange-500">{pendingApps}</p>
          </div>
        )}
      </div>
    </div>
  )
}
