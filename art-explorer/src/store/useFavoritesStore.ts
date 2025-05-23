import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: number[]
  toggle: (id: number) => void
  isFavorite: (id: number) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (id) => {
        const { favorites } = get()
        const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]
        set({ favorites: updated })
      },
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'favorites-storage',
    }
  )
)
