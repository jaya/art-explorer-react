'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'light' } = useTheme()

  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--background)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border-border)',
        } as React.CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      {...props}
    />
  )
}
