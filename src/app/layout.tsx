import '~/shared/styles/globals.css'

import { Inria_Serif, Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { Providers } from '~/core/providers'
import { Footer } from '~/shared/components/Footer'
import { Header } from '~/shared/components/Header'
import { Toaster } from '~/shared/components/Toaster'
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
    <html
      lang="en"
      suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          inriaSerif.variable,
          'flex min-h-dvh min-w-xs flex-col bg-background font-sans antialiased',
        )}>
        <Providers>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  )
}
