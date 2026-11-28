'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  LayoutDashboard,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  X,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface Props {
  role: 'ADMIN' | 'SENSEI' | string
  userName?: string | null
  children: React.ReactNode
}

export function DashboardSidebar({ role, userName, children }: Props) {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/kanji', label: 'Kelola Kanji', icon: BookOpen, exact: false },
    { href: '/dashboard/questions', label: 'Bank Soal', icon: FileQuestion, exact: false },
    ...(role === 'ADMIN'
      ? [{ href: '/dashboard/applications', label: 'Verifikasi Sensei', icon: UserCheck, exact: false }]
      : []),
  ]

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Burgundy Brand Header */}
      <div className="p-5 bg-[#800020] text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-white/75 font-bold">
                KanjiPaham Portal
              </p>
              <h2 className="text-base font-bold truncate">
                {role === 'ADMIN' ? 'Admin Panel' : 'Sensei Panel'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/15 text-white"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>
        {userName && (
          <p className="mt-3 text-xs text-white/80 truncate border-t border-white/15 pt-2.5">
            Masuk sebagai <strong className="text-white">{userName}</strong>
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-card-muted/60'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border-color space-y-2">
        <button
          type="button"
          onClick={toggle}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border-color bg-card-muted/30 hover:bg-card-muted text-xs font-bold text-text-main transition-colors"
        >
          <span>{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</span>
          {theme === 'dark' ? <Sun size={15} className="text-secondary" /> : <Moon size={15} className="text-[#800020]" />}
        </button>

        <Link
          href="/learn"
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#800020] dark:text-[#F28482] hover:bg-[#800020]/10 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Aplikasi</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-text-main w-full">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#800020] text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
            aria-label="Buka menu admin"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/75 font-bold leading-none">
              KanjiPaham
            </p>
            <span className="text-sm font-bold">
              {role === 'ADMIN' ? 'Admin Panel' : 'Sensei Panel'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
          aria-label="Ganti tema"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-68 max-w-[80vw] h-full bg-surface border-r border-border-color shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop Standalone Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-surface border-r border-border-color sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* Standalone Admin Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  )
}
