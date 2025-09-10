import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SimpleThemeProvider } from '@/components/providers/simple-theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'FitSpark ⚡ - Челленджи здоровья',
  description: 'Превращай здоровые привычки в увлекательную игру. Выполняй ежедневные челленджи, зарабатывай очки и соревнуйся с друзьями.',
  keywords: ['фитнес', 'здоровье', 'челленджи', 'привычки', 'мотивация'],
  authors: [{ name: 'FitSpark Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <SimpleThemeProvider defaultTheme="dark">
          {/* Background gradient */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-pink-900/40" />
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-purple-900/20 to-cyan-900/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-cyan-900/40" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-slate-900/90 dark:bg-slate-900/95" />
          </div>

          {children}
          <Toaster />
        </SimpleThemeProvider>
      </body>
    </html>
  )
}