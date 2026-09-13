'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'id' | 'en'

interface LanguageContextType {
  lang: Language
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('id')

  useEffect(() => {
    const saved = localStorage.getItem('kanjipaham-lang') as Language
    if (saved === 'id' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'id' ? 'en' : 'id'
      localStorage.setItem('kanjipaham-lang', next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
