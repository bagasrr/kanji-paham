import type { Metadata } from 'next'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap"
        />
      </head>
      <body className="bg-background min-h-screen antialiased flex flex-col md:flex-row relative">
        <NextTopLoader
          color="#D62828"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px rgba(214, 40, 40, 0.5), 0 0 5px rgba(214, 40, 40, 0.3)"
        />
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
