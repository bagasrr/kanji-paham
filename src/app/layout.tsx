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
  icons: {
    icon: [
      { url: '/assets/KanjiPahamLogo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/assets/KanjiPahamLogo.png',
    apple: '/assets/KanjiPahamLogo.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background min-h-screen antialiased flex flex-col md:flex-row relative">
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <TopBar />
              <BottomNav />
              <main className="flex-1 min-h-screen pb-safe md:pb-0 md:ml-60 w-full relative z-0">
                <div className="max-w-3xl mx-auto w-full px-4 pt-16 md:pt-8">
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
