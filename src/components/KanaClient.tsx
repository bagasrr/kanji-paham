'use client'

import { useState } from 'react'
import type { KanaEntry } from '@/lib/types'

interface Props {
  data: KanaEntry[]
}

export function KanaClient({ data }: Props) {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana')

  const items = data.filter((k) => k.type === activeTab)

  return (
    <div>
      {/* Tabs */}
      <div className="flex p-1 bg-surface border border-border-color rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('hiragana')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'hiragana'
              ? 'bg-background shadow-sm text-primary'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Hiragana
        </button>
        <button
          onClick={() => setActiveTab('katakana')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'katakana'
              ? 'bg-background shadow-sm text-primary'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Katakana
        </button>
      </div>

      {/* Kana Grid */}
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {items.map((item) => (
          <div
            key={item.character}
            className="aspect-square flex flex-col items-center justify-center bg-surface border border-border-color rounded-xl hover:border-primary/50 transition-colors cursor-pointer group"
          >
            {/* SVG implementation placeholder - For now just text, or render SVG */}
            <div className="text-3xl md:text-4xl text-text-main font-medium group-hover:text-primary transition-colors">
              {item.character}
            </div>
            <div className="text-xs text-text-muted mt-1">{item.romaji}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
