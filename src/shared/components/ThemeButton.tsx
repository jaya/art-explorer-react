'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '~/shared/hooks/useTheme'

export function ThemeButton() {
  const { theme, setTheme, isReady } = useTheme()

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!isReady) return null

  return (
    <button
      className="cursor-pointer rounded-full bg-background p-2 transition-colors duration-300 hover:bg-accent-foreground hover:text-accent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2.5]"
      disabled={!isReady}
      onClick={handleClick}
      type="button">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
