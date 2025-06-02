'use client'

import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { logUserAction } from '~/shared/helpers/logger'
import { useTheme } from '~/shared/hooks/useTheme'

export function ThemeButton() {
  const { theme, setTheme, systemTheme, isReady } = useTheme()

  const handleClick = () => {
    if (systemTheme === 'system' || theme === 'dark') {
      logUserAction('click:themeButton', { theme: 'light' })
      setTheme('light')
    } else {
      logUserAction('click:themeButton', { theme: 'dark' })
      setTheme('dark')
    }
  }

  if (!isReady) return <div className="size-10" />

  return (
    <button
      className="cursor-pointer rounded-full bg-transparent p-2 transition-colors duration-300 hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2]"
      data-testid="theme-button"
      data-theme={theme}
      disabled={!isReady}
      onClick={handleClick}
      type="button">
      <motion.div
        animate={{ rotate: 0, opacity: 1 }}
        className="flex items-center justify-center text-primary-foreground"
        exit={{ rotate: 90, opacity: 0 }}
        initial={{ rotate: -90, opacity: 0 }}
        key={theme}
        transition={{ duration: 0.3 }}>
        {theme === 'dark' ? <Sun /> : <Moon />}
      </motion.div>
    </button>
  )
}
