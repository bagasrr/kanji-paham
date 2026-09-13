'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, AlignJustify, Brain, User, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const NAV_ITEMS = [
  { href: '/kana', icon: AlignJustify, label: 'Kana' },
  { href: '/learn', icon: BookOpen, label: 'Kanji' },
  { href: '/quiz', icon: Brain, label: 'Quiz' },
  { href: '/profile', icon: User, label: 'Profile' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:w-64 md:h-screen md:border-r z-50 bg-surface border-t md:border-t-0 border-border-color md:p-6 flex flex-col justify-between"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="hidden md:flex mb-8 px-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-text-main">🇯🇵 KanjiPaham</h1>
          <p className="text-xs text-text-muted mt-1">Belajar Bahasa Jepang</p>
        </div>
      </div>

      <div className="w-full flex md:flex-col justify-around md:justify-start gap-2 relative">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 md:flex-none flex md:flex-row flex-col items-center md:justify-start gap-1 md:gap-4 py-3 md:px-4 md:py-4 rounded-xl transition-colors ${
                active
                  ? 'text-primary md:bg-red-50 md:dark:bg-red-950/20'
                  : 'text-text-muted/80 hover:text-[#1F2937] dark:hover:text-[#F8FAFC] md:hover:bg-slate-50 md:dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] md:text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
      <div className="hidden md:block mt-auto text-xs text-text-muted/80 px-4">
        &copy; {new Date().getFullYear()} KanjiPaham
      </div>
    </nav>
  )
}
