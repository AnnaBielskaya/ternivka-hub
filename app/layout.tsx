import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Тернівка | Склади',
  description: 'Medical inventory system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <body className={nunito.className}>{children}</body>
    </html>
  )
}