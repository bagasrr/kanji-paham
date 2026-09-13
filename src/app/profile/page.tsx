import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogOut, LayoutDashboard, UserCheck, Flame, BookMarked, Trophy } from 'lucide-react'

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
      <div className="py-2 pb-24 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-main mb-8 tracking-tight text-center">Profil Saya</h1>
        
        <div className="bg-surface rounded-3xl border border-border-color p-8 text-center shadow-lg shadow-black/5 mb-8 relative overflow-hidden">
          <div className="pattern-washi absolute inset-0 z-0"></div>
          <div className="relative z-10">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name || 'User'} className="w-24 h-24 rounded-full mx-auto mb-5 border-4 border-white shadow-md object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl mx-auto mb-5 shadow-md border-4 border-white">
                👤
              </div>
            )}
            <h2 className="text-2xl text-text-main font-bold mb-1">{session.user.name || 'User'}</h2>
            <p className="text-sm text-text-muted mb-6 font-medium">{session.user.email}</p>
            
            {/* Role Badges */}
            <div className="mb-8">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border shadow-sm ${
                session.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                session.user.role === 'SENSEI' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-card-muted text-text-muted border-border-color'
              }`}>
                {session.user.role === 'ADMIN' && <UserCheck size={14} />}
                {session.user.role === 'SENSEI' && <BookMarked size={14} />}
                {session.user.role || 'GAKUSEI'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card-muted/50 rounded-2xl p-4 border border-border-color text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <BookMarked size={18} />
                  <span className="font-bold">Kanji</span>
                </div>
                <div className="text-2xl font-bold text-text-main">0</div>
                <div className="text-xs text-text-muted">Dikuasai</div>
              </div>
              <div className="bg-card-muted/50 rounded-2xl p-4 border border-border-color text-center">
                <div className="flex items-center justify-center gap-2 text-secondary mb-1">
                  <Flame size={18} />
                  <span className="font-bold">Streak</span>
                </div>
                <div className="text-2xl font-bold text-text-main">0</div>
                <div className="text-xs text-text-muted">Hari</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {(session.user.role === 'SENSEI' || session.user.role === 'ADMIN') && (
                <Link
                  href="/dashboard"
                  className="w-full py-3.5 rounded-2xl bg-secondary text-white font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-sm hover:shadow-md"
                >
                  <LayoutDashboard size={18} />
                  Dashboard {session.user.role === 'ADMIN' ? 'Admin' : 'Sensei'}
                </Link>
              )}

              {session.user.role !== 'SENSEI' && session.user.role !== 'ADMIN' && (
                <Link
                  href="/profile/apply-sensei"
                  className="w-full py-3.5 rounded-2xl border-2 border-secondary text-secondary font-bold flex items-center justify-center gap-2 hover:bg-secondary/10 transition-colors"
                >
                  <Trophy size={18} />
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
                className="w-full py-3.5 rounded-2xl bg-card-muted text-text-main font-bold flex items-center justify-center gap-2 hover:bg-border transition-colors"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </form>
          </div>
        </div>

        {weakKanjis.length > 0 && (
          <div className="bg-surface rounded-3xl border border-border-color p-8 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <span className="text-primary">🔥</span> Fokus Belajar
            </h2>
            <p className="text-sm text-text-muted mb-6">Kanji berikut butuh lebih banyak perhatian darimu.</p>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
              {weakKanjis.map(wk => (
                <div key={wk.character} className="aspect-square bg-card-muted/30 border border-border-color rounded-2xl flex flex-col items-center justify-center relative hover:border-primary transition-colors group cursor-default">
                  <span className="text-3xl font-serif text-text-main group-hover:text-primary transition-colors" style={{ fontFamily: "'Noto Serif JP', serif" }}>{wk.character}</span>
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
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
    <div className="py-2 pb-24 max-w-lg mx-auto">
      <div className="bg-surface rounded-3xl border border-border-color p-8 md:p-12 text-center shadow-lg shadow-black/5 relative overflow-hidden mt-8">
        <div className="pattern-washi absolute inset-0 z-0"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-card-muted flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white text-6xl text-primary font-serif select-none" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            大
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">Belum Masuk</h2>
          <p className="text-text-muted mb-8 font-medium leading-relaxed">
            Simpan progres belajarmu, ikuti simulasi ujian, dan kuasai ratusan Kanji dengan mendaftar gratis.
          </p>
          <Link
            href="/auth/login"
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
          >
            Masuk / Daftar
          </Link>
        </div>
      </div>
    </div>
  )
}
