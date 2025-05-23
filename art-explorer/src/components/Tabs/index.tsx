import { NavLink } from 'react-router-dom'
import { Search, Heart } from 'lucide-react'
import { t } from 'i18next'

export default function Tabs() {
  const tabs = [
    {
      to: '/',
      label: (
        <div className="flex items-center gap-2">
          <Search />
          {t('tabs.search')}
        </div>
      ),
    },
    {
      to: '/favorites',
      label: (
        <div className="flex items-center gap-2">
          <Heart />
          {t('tabs.favorites')}
        </div>
      ),
    },
  ]

  function getTabClass(isActive: boolean) {
    const baseClasses = 'pb-3 text-lg transition-colors'
    const activeClasses = 'border-b-2 border-teal-800 dark:border-teal-400 text-teal-800 dark:text-teal-400 font-medium'
    const inactiveClasses = 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
    return [baseClasses, isActive ? activeClasses : inactiveClasses].join(' ')
  }

  return (
    <nav className="mt-6 border-b border-slate-700 flex gap-8">
      {tabs.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) => getTabClass(isActive)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
