'use client'

import { useTheme } from '@/components/ThemeProvider'
import { useLanguage } from '@/components/LanguageProvider'
import { Sun, Moon, Languages } from 'lucide-react'

export function TopBar() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggleLang } = useLanguage()

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface border border-border-color shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-text-main font-medium"
        title="Ubah Bahasa"
      >
        <Languages size={16} className="text-primary" />
        <span className="text-xs tracking-wider">{lang === 'id' ? 'ID' : 'EN'}</span>
      </button>

      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border-color shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-primary"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
      </button>
    </div>
  )
}
