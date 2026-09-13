import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageProvider'
import { BottomNav } from '@/components/BottomNav'
import { ToastProvider } from '@/components/Toast'
import { TopBar } from '@/components/TopBar'

export const metadata: Metadata = {
  title: 'KanjiPaham',
  description: 'Belajar Kanji dan Kana Jepang secara mobile-first, terstruktur, dan efektif.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background min-h-screen antialiased flex flex-col md:flex-row">
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <TopBar />
              <BottomNav />
              <main className="flex-1 min-h-screen pb-20 md:pb-0 md:ml-64 w-full">
                <div className="max-w-5xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
