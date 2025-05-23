import { useFavoritesStore } from '../../store/useFavoritesStore'
import Artwork from '../../components/Artwork'
import { t } from 'i18next'

export default function Favorites() {
  const favorites = useFavoritesStore((s) => s.favorites)

  return (
    <div className="flex flex-col items-center gap-6 mt-8 px-4">
      <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-50 ">{t('favorites.title')}</h2>

      {favorites.length === 0 ? (
        <p className="text-slate-400 text-sm">{t('favorites.empty')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
          {favorites.map((id) => (
            <Artwork key={id} id={id} />
          ))}
        </div>
      )}
    </div>
  )
}
