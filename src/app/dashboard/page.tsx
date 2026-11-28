import Link from 'next/link'
import { BookOpen, FileQuestion, FileText, Languages, Layers, UserCheck } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  const [
    totalKanji,
    totalVocab,
    totalDokkai,
    totalVocabExam,
    totalQuestions,
    pendingApps,
  ] = await Promise.all([
    prisma.kanji.count(),
    prisma.vocab.count(),
    prisma.dokkaiPassage.count(),
    prisma.vocabExamQuestion.count(),
    prisma.customQuestion.count(),
    session?.user?.role === 'ADMIN'
      ? prisma.teacherApplication.count({ where: { status: 'PENDING' } })
      : Promise.resolve(0),
  ])

  const cards = [
    {
      href: '/dashboard/kanji',
      label: 'Total Kanji',
      value: totalKanji,
      hint: 'Kelola Kanji, Mnemonic & Komponen →',
      icon: BookOpen,
    },
    {
      href: '/dashboard/kanji',
      label: 'Contoh Kosakata',
      value: totalVocab,
      hint: 'Edit kata, contoh kalimat & audio →',
      icon: Layers,
    },
    {
      href: '/dashboard/dokkai',
      label: 'Bacaan Dokkai',
      value: totalDokkai,
      hint: 'Kelola wacana, soal & audio →',
      icon: FileText,
    },
    {
      href: '/dashboard/vocab-exam',
      label: 'Soal Kontekstual',
      value: totalVocabExam,
      hint: 'Kelola parafrasa, pemakaian & audio →',
      icon: Languages,
    },
    {
      href: '/dashboard/questions',
      label: 'Soal Kustom',
      value: totalQuestions,
      hint: 'Buka bank & butir soal →',
      icon: FileQuestion,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#800020] to-[#A31637] text-white p-6 sm:p-8 shadow-md">
        <p className="text-xs uppercase tracking-widest text-white/80 font-bold mb-1">
          Portal Manajemen Terpadu
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-white/85 mt-1.5 max-w-2xl">
          Kelola Kanji N5–N1, mnemonic, contoh kata &amp; kalimat, bacaan Dokkai, soal kontekstual, bank soal kustom, serta upload/generate audio ElevenLabs ke Supabase Storage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ href, label, value, hint, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group bg-surface p-5 rounded-2xl border border-border-color hover:border-[#800020] shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {label}
              </span>
              <Icon size={18} className="text-[#800020] dark:text-[#F28482]" />
            </div>
            <p className="text-3xl font-bold text-text-main group-hover:text-[#800020] dark:group-hover:text-[#F28482] transition-colors">
              {value}
            </p>
            <p className="text-xs text-text-subtle mt-1">{hint}</p>
          </Link>
        ))}

        {session?.user?.role === 'ADMIN' && (
          <Link
            href="/dashboard/applications"
            className="group bg-surface p-5 rounded-2xl border border-border-color hover:border-[#800020] shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Sensei Pending
              </span>
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
