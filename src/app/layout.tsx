import '~/shared/styles/globals.css'

import { Inria_Serif, Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '~/shared/components/Footer'
import { Header } from '~/shared/components/Header'
import { cn } from '~/shared/utils/className'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inria-serif',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, inriaSerif.variable, 'flex min-h-dvh flex-col font-sans')}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
