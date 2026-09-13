'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  prevUrl?: string
  nextUrl?: string
}

export function KanjiNavigation({ prevUrl, nextUrl }: Props) {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && prevUrl) {
        router.push(prevUrl)
      } else if (e.key === 'ArrowRight' && nextUrl) {
        router.push(nextUrl)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevUrl, nextUrl, router])

  return (
    <div className="flex items-center justify-between mt-6 max-w-4xl mx-auto">
      {prevUrl ? (
        <Link
          href={prevUrl}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-color bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-text-main font-medium"
        >
          <ChevronLeft size={20} /> Sebelumnya
        </Link>
      ) : (
        <div />
      )}
      {nextUrl ? (
        <Link
          href={nextUrl}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-color bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-text-main font-medium"
        >
          Selanjutnya <ChevronRight size={20} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
