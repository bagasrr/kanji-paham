import { KanaClient } from '@/components/KanaClient'
import type { KanaEntry } from '@/lib/types'

export default async function KanaPage() {
  // Read kana data
  const data = await import('@/data/kana/kana.json').then((m) => m.default as KanaEntry[])

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-text-main mb-2">Kana</h1>
      <p className="text-text-muted mb-6">Hiragana & Katakana</p>
      
      <KanaClient data={data} />
    </div>
  )
}
