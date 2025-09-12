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
      <body className={inter.className} suppressHydrationWarning>
        <SimpleThemeProvider defaultTheme="dark">
          {/* Background gradient with better theme contrast */}
          <div className="fixed inset-0 -z-10">
            {/* Light theme background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:hidden" />
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-100/50 via-purple-100/50 to-cyan-100/50 dark:hidden" />
            <div className="absolute inset-0 bg-white/80 dark:hidden" />
            
            {/* Dark theme background */}
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40" />
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-tl from-indigo-900/40 via-purple-900/40 to-cyan-900/40" />
            <div className="hidden dark:block absolute inset-0 backdrop-blur-3xl" />
            <div className="hidden dark:block absolute inset-0 bg-slate-900/95" />
          </div>

          {children}
          <Toaster />
        </SimpleThemeProvider>
      </body>
    </html>
  )
}