import { motion } from 'framer-motion'
import { useSearchStore } from '../../store/useSearchStore'
import { t } from 'i18next'

export type SearchMode = 'object' | 'artist'

export default function SearchModeToggle() {
  const mode = useSearchStore((s) => s.mode)
  const setMode = useSearchStore((s) => s.setMode)

  const modes = [
    { key: 'object', label: t('home.object') },
    { key: 'artist', label: t('home.artistOrCulture') },
  ] as const

  return (
    <div className="flex flex-col gap-1">
      <label className='text-xs text-slate-600 dark:text-slate-300 font-bold'>
        {t('home.searchBy')}
      </label>
      <div className="flex rounded-full bg-slate-50 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-600">
        {modes.map(({ key, label }) => {
          const active = key === mode
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`relative px-4 py-1 text-sm rounded-full cursor-pointer ${
                active ? 'text-neutral-50' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active"
                  transition={{ type: 'spring', duration: 0.3 }}
                  className="absolute inset-0 dark:bg-teal-400 bg-teal-800 rounded-full z-0"
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
