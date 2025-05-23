import { t } from 'i18next'
import { Search } from 'lucide-react'
import { useSearchStore } from '../../store/useSearchStore'

export default function SearchInput() {
  const query = useSearchStore((s) => s.query)
  const setQuery = useSearchStore((s) => s.setQuery)

  return (
    <div className="w-full">
      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition">
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.searchPlaceholder')}
          className="flex-1 bg-transparent text-black dark:text-white placeholder:text-slate-400 outline-none px-3"
        />
      </div>
    </div>
  )
}
