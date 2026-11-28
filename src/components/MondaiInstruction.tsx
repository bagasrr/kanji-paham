'use client'

import { HelpCircle } from 'lucide-react'

interface Props {
  jp: string
  guideId: string
  guideEn: string
  lang: 'id' | 'en'
}

/**
 * Displays an authentic Japanese JLPT-style question instruction ("問題 ... 1・2・3・4から一つ選びなさい")
 * paired with a concise Indonesian/English how-to-answer guide.
 */
export function MondaiInstruction({ jp, guideId, guideEn, lang }: Props) {
  return (
    <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-left">
      <div className="flex items-start gap-2.5">
        <HelpCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
        <div className="min-w-0 space-y-1">
          <p
            className="text-xs sm:text-sm font-bold text-text-main leading-relaxed font-jp"
          >
            {jp}
          </p>
          <p className="text-xs text-text-muted leading-snug">
            {lang === 'id' ? guideId : guideEn}
          </p>
        </div>
      </div>
    </div>
  )
}
