'use client'

import { usePathname } from 'next/navigation'
import { TopBar } from '@/components/TopBar'
import { BottomNav } from '@/components/BottomNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  if (isDashboard) {
    return <div className="min-h-screen w-full bg-background">{children}</div>
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative w-full">
      <TopBar />
      <BottomNav />
      <main className="flex-1 min-h-screen pb-safe md:pb-0 md:ml-60 w-full relative z-0">
        <div className="max-w-3xl mx-auto w-full px-4 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
