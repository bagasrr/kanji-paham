import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()

  let weakKanjis: { character: string, mistakeCount: number }[] = []

  if (session && session.user) {
    weakKanjis = await prisma.weakKanji.findMany({
      where: { userId: session.user.id },
      orderBy: { mistakeCount: 'desc' },
      take: 10
    })
    
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-text-main mb-6">Profil</h1>
        <div className="bg-surface rounded-2xl border border-border-color p-6 text-center shadow-sm mb-6">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt={session.user.name || 'User'} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-border-color" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl mx-auto mb-4">
              👤
            </div>
          )}
          <p className="text-xl text-text-main font-semibold mb-1">{session.user.name || 'User'}</p>
          <p className="text-sm text-text-muted mb-6">{session.user.email}</p>
          
          {/* Role Badges & Actions */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
              session.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
              session.user.role === 'SENSEI' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}>
              {session.user.role || 'GAKUSEI'}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {(session.user.role === 'SENSEI' || session.user.role === 'ADMIN') && (
              <Link
                href="/dashboard"
                className="block w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Dashboard {session.user.role === 'ADMIN' ? 'Admin' : 'Sensei'}
              </Link>
            )}

            {session.user.role !== 'SENSEI' && session.user.role !== 'ADMIN' && (
              <Link
                href="/profile/apply-sensei"
                className="block w-full py-3 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                Daftar Jadi Sensei
              </Link>
            )}
          </div>
          
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/auth/login' })
          }}>
            <button
              type="submit"
              className="block w-full py-3 rounded-xl border border-[#E5E7EB] dark:border-slate-600 text-[#1F2937] dark:text-[#F8FAFC] font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>

        {weakKanjis.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-text-main mb-3">Kanji yang Perlu Dilatih</h2>
            <div className="grid grid-cols-5 gap-2">
              {weakKanjis.map(wk => (
                <div key={wk.character} className="aspect-square bg-surface border border-border-color rounded-xl flex flex-col items-center justify-center relative">
                  <span className="text-2xl font-serif text-text-main">{wk.character}</span>
                  <span className="absolute -top-1 -right-1 bg-red-100 dark:bg-red-900/50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                    {wk.mistakeCount}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-text-main mb-6">Profil</h1>
      <div className="bg-surface rounded-2xl border border-border-color p-6 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl mx-auto mb-4">
          👤
        </div>
        <p className="text-text-main font-semibold mb-1">Tamu</p>
        <p className="text-sm text-text-muted mb-6">Masuk untuk menyimpan progres belajar Anda</p>
        <Link
          href="/auth/login"
          className="block w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-red-700 transition-colors"
        >
          Masuk / Daftar
        </Link>
      </div>
    </div>
  )
}
