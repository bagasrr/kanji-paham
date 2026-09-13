import Link from 'next/link'
import { Lock } from 'lucide-react'

const LEVELS = [
  { level: 5, label: 'N5', title: 'Pemula', description: 'Mulai perjalanan Kanji-mu', count: 79, color: '#5C946E', emoji: '🌱', gradient: 'from-emerald-50 to-green-100', locked: false },
  { level: 4, label: 'N4', title: 'Dasar', description: 'Kanji sehari-hari yang penting', count: 166, color: '#F4A261', emoji: '🌿', gradient: 'from-orange-50 to-amber-100', locked: false },
  { level: 3, label: 'N3', title: 'Menengah', description: 'Teks umum & berita sederhana', count: 367, color: '#E9C46A', emoji: '🌸', gradient: 'from-yellow-50 to-amber-100', locked: false },
  { level: 2, label: 'N2', title: 'Lanjutan', description: 'Hampir semua konteks bacaan', count: 367, color: '#F28482', emoji: '🌺', gradient: 'from-rose-50 to-pink-100', locked: false },
  { level: 1, label: 'N1', title: 'Mahir', description: 'Menguasai Kanji selevel penutur asli', count: 1232, color: '#D62828', emoji: '⛩️', gradient: 'from-red-50 to-rose-100', locked: false },
]

export default function LearnPage() {
  return (
    <div className="py-2 pb-10">
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">🗾 Perjalanan Kanji</h1>
        <p className="text-text-muted mt-3 font-medium">Pilih levelmu dan mulai kuasai Kanji sedikit demi sedikit.</p>
      </div>
      
      <div className="space-y-6 relative max-w-2xl mx-auto z-10">
        {LEVELS.map(({ level, label, title, description, count, color, emoji, gradient, locked }) => (
          <div key={level} className="relative group">
            {locked ? (
              <div className="flex flex-col md:flex-row md:items-center bg-surface border border-border-color rounded-2xl overflow-hidden shadow-sm opacity-60 grayscale cursor-not-allowed">
                <div className={`w-full md:w-32 py-6 md:py-8 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} dark:bg-card-muted/20 border-b md:border-b-0 md:border-r border-border-color`} style={{ borderLeft: `4px solid ${color}` }}>
                  <span className="text-3xl font-bold mb-1" style={{ color }}>{label}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">{title}</span>
                </div>
                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-text-main mb-1">{description}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-2">
                      <span className="text-xl">{emoji}</span> {count} Kanji
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto bg-card-muted px-3 py-1.5 rounded-full border border-border-color">
                    <Lock size={14} className="text-text-muted" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Segera</span>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href={`/learn/${level}`}
                className="flex flex-col md:flex-row md:items-center bg-surface border border-border-color rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-full md:w-36 py-6 md:py-10 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} dark:bg-opacity-10 border-b md:border-b-0 md:border-r border-border-color/50 transition-colors group-hover:brightness-105`} style={{ borderLeft: `5px solid ${color}` }}>
                  <span className="text-4xl font-extrabold mb-2" style={{ color }}>{label}</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80" style={{ color }}>{title}</span>
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-xl text-text-main mb-2 group-hover:text-primary transition-colors">{description}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-2 font-medium">
                      <span>{count} Kanji</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span className="text-lg" role="img" aria-label={title}>{emoji}</span>
                    </p>
                  </div>
                  <div className="self-start md:self-auto flex items-center text-primary font-bold text-sm tracking-wide bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full transition-colors">
                    Mulai Belajar &rarr;
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
