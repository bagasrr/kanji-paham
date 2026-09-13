'use client'

import { useLanguage } from '@/components/LanguageProvider'

interface Props {
  meanings: string[]
  meanings_id?: string[]
}

export function KanjiMeaning({ meanings, meanings_id }: Props) {
  const { lang } = useLanguage()

  const displayMeaning =
    lang === 'id' && meanings_id && meanings_id.length > 0
      ? meanings_id[0]
      : meanings[0] || ''

  return <span className="capitalize">{displayMeaning}</span>
}
