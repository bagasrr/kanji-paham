import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    redirect('/profile')
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {session.user.role === 'ADMIN' ? 'Admin Panel' : 'Sensei Panel'}
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
            Overview
          </Link>
          <Link href="/dashboard/kanji" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
            Kelola Kanji
          </Link>
          <Link href="/dashboard/questions" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
            Bank Soal
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link href="/dashboard/applications" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
              Verifikasi Sensei
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/profile" className="block px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            Kembali ke Aplikasi
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
