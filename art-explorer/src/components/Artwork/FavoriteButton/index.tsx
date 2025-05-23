import { Heart } from 'lucide-react'
import { useFavoritesStore } from '../../../store/useFavoritesStore'

type Props = {
  id: number
}

export default function FavoriteButton({ id }: Props) {
  const isFav = useFavoritesStore((s) => s.isFavorite(id))
  const toggle = useFavoritesStore((s) => s.toggle)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggle(id)
      }}
      className="bottom-3 right-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      data-testid='favorite-button'
    >
      <Heart
        className={`w-5 h-5 ${ isFav ? 'text-red-500 fill-red-500' : 'text-slate-400' }`}
      />
    </button>
  )
}
