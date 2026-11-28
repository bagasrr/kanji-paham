import Link from 'next/link'
import { BookOpen, FileQuestion, Layers, UserCheck } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  const [totalKanji, totalRadicals, totalQuestions, pendingApps] = await Promise.all([
    prisma.kanji.count(),
    prisma.radical.count(),
    prisma.customQuestion.count(),
    session?.user?.role === 'ADMIN'
      ? prisma.teacherApplication.count({ where: { status: 'PENDING' } })
      : Promise.resolve(0),
  ])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#800020] to-[#A31637] text-white p-6 sm:p-8 shadow-md">
        <p className="text-xs uppercase tracking-widest text-white/80 font-bold mb-1">
          Portal Manajemen Terpadu
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-white/85 mt-1.5 max-w-xl">
          Kelola data Kanji N5–N1, bank soal kustom, dan verifikasi pengajuan Sensei dari satu portal terpisah.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/kanji"
          className="group bg-surface p-5 rounded-2xl border border-border-color hover:border-[#800020] shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Kanji</span>
            <BookOpen size={18} className="text-[#800020] dark:text-[#F28482]" />
          </div>
          <p className="text-3xl font-bold text-text-main group-hover:text-[#800020] dark:group-hover:text-[#F28482] transition-colors">
            {totalKanji}
          </p>
          <p className="text-xs text-text-subtle mt-1">Klik untuk kelola kanji &rarr;</p>
        </Link>

        <div className="bg-surface p-5 rounded-2xl border border-border-color shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Radikal</span>
            <Layers size={18} className="text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text-main">{totalRadicals}</p>
          <p className="text-xs text-text-subtle mt-1">Terhubung ke N5–N1</p>
        </div>

        <Link
          href="/dashboard/questions"
          className="group bg-surface p-5 rounded-2xl border border-border-color hover:border-[#800020] shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Soal Kustom</span>
            <FileQuestion size={18} className="text-[#800020] dark:text-[#F28482]" />
          </div>
          <p className="text-3xl font-bold text-text-main group-hover:text-[#800020] dark:group-hover:text-[#F28482] transition-colors">
            {totalQuestions}
          </p>
          <p className="text-xs text-text-subtle mt-1">Buka bank soal &rarr;</p>
        </Link>

        {session?.user?.role === 'ADMIN' && (
          <Link
            href="/dashboard/applications"
            className="group bg-surface p-5 rounded-2xl border border-border-color hover:border-[#800020] shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sensei Pending</span>
              <UserCheck size={18} className="text-warning" />
            </div>
            <p className="text-3xl font-bold text-warning">{pendingApps}</p>
            <p className="text-xs text-text-subtle mt-1">Verifikasi pengajuan &rarr;</p>
          </Link>
        )}
      </div>
    </div>
  )
}
