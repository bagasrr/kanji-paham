'use client'

import { useTheme } from '@/components/ThemeProvider'
import { useLanguage } from '@/components/LanguageProvider'
import { Sun, Moon, Languages } from 'lucide-react'

export function TopBar() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggleLang } = useLanguage()

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border-color shadow-sm hover:border-primary transition-all text-text-main"
        title="Ubah Bahasa"
      >
        <Languages size={18} />
        <span className="text-xs font-bold uppercase">{lang}</span>
      </button>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl bg-surface border border-border-color shadow-sm hover:border-primary transition-all text-text-main"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  )
}
