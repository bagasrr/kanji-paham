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
    <div className="mt-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex flex-row items-center justify-between gap-4">
        {prevUrl ? (
          <Link
            href={prevUrl}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-2xl border border-border-color bg-surface hover:bg-card-muted transition-colors text-text-main font-medium shadow-sm hover:shadow"
          >
            <ChevronLeft size={20} /> <span className="hidden sm:inline">Sebelumnya</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        
        {nextUrl ? (
          <Link
            href={nextUrl}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-primary-hover transition-colors font-bold shadow-md hover:shadow-lg"
          >
            <span className="hidden sm:inline">Berikutnya</span> <ChevronRight size={20} className="text-white" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
      <p className="mt-4 text-xs text-text-subtle hidden md:block">
        Gunakan tombol <kbd className="px-1.5 py-0.5 bg-surface border border-border-color rounded text-[10px]">←</kbd> dan <kbd className="px-1.5 py-0.5 bg-surface border border-border-color rounded text-[10px]">→</kbd> untuk navigasi cepat
      </p>
    </div>
  )
}
