import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { ThemeProvider } from '@/components/providers/theme-provider'
// import { Toaster } from '@/components/ui/sonner'

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
    <html lang="ru">
      <body className={inter.className}>
        {/* Background gradient */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-purple-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  )
}