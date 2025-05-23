import { t } from 'i18next'
import Tabs from '../Tabs'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export default function Header() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <header className="relative pb-6">
      <div className='flex items-start justify-between gap-4'>
        <h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-50">{t('appName')}</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="top-0 right-0 rounded-full border border-slate-600 p-2 dark:hover:bg-slate-600 hover:bg-slate-700 transition cursor-pointer"
          aria-label={t('darkModeToggle')}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-30" />
          )}
        </button>
      </div>
      <Tabs />
    </header>
  )
}
