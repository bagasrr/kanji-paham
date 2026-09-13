'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Brain, User, AlignJustify, Info } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

export function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLanguage()

  const navItems = [
    { href: '/learn', icon: Home, label: lang === 'id' ? 'Beranda' : 'Home' },
    { href: '/kana', icon: AlignJustify, label: 'Kana' },
    { href: '/quiz', icon: Brain, label: 'Quiz' },
    { href: '/profile', icon: User, label: lang === 'id' ? 'Profil' : 'Profile' },
    { href: '/info', icon: Info, label: 'Info' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:w-60 md:h-screen md:border-r z-50 bg-surface border-t md:border-t-0 border-border-color pb-[env(safe-area-inset-bottom)] md:pb-0 md:flex md:flex-col justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] md:shadow-none">
      <div className="hidden md:block px-6 pt-8 pb-6 border-b border-border-color/50">
        <Link href="/learn" className="flex items-center gap-3 group">
          <Image
            src="/assets/KanjiPahamLogo.png"
            alt="KanjiPaham Logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-2xl object-contain shadow-sm group-hover:scale-105 transition-transform"
            priority
          />
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight leading-none">KanjiPaham</h1>
            <p className="text-xs text-text-muted mt-1 font-medium">Belajar Kanji</p>
          </div>
        </Link>
      </div>

      <div className="w-full h-16 md:h-auto flex md:flex-col justify-around md:justify-start items-center md:items-stretch gap-1 md:gap-2 p-2 md:p-6 md:pt-6">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 md:flex-none flex md:flex-row flex-col items-center md:justify-start gap-1 md:gap-4 py-1 md:py-3 px-1.5 md:px-5 rounded-2xl md:rounded-xl transition-all duration-300 ${
                active
                  ? 'text-primary md:bg-primary/10 md:text-primary md:font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-surface/80 md:hover:bg-card-muted/50'
              }`}
            >
              <Icon 
                size={20} 
                strokeWidth={active ? 2.5 : 2} 
                className={`transition-transform duration-300 ${active ? 'scale-110 md:scale-100' : ''}`}
              />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
      
      <div className="hidden md:block mt-auto p-6 text-center">
        <div className="pattern-washi absolute inset-0 z-[-1]"></div>
        <p className="text-xs text-text-subtle font-serif italic mb-2 tracking-widest text-sakura">桜が咲くように</p>
        <Link 
          href="/info"
          className="text-xs text-text-muted/70 hover:text-primary transition-colors block"
        >
          &copy; {new Date().getFullYear()} KanjiPaham · {lang === 'id' ? 'Info & Kontak' : 'About & Contact'}
        </Link>
      </div>
    </nav>
  )
}
