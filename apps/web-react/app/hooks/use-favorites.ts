import { FAVORITES_KEY } from '@/constants/gallery.constant'
import { useCallback, useEffect, useState } from 'react'

function getFavorites(): number[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? (JSON.parse(stored) as number[]) : []
  } catch {
    return []
  }
}

function setFavorites(favorites: number[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {}
}

export const useFavorites = () => {
  const [favorites, setFavoritesState] = useState<number[]>([])

  useEffect(() => {
    setFavoritesState(getFavorites())
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  )

  const addFavorite = useCallback((id: number) => {
    const stored = getFavorites()
    if (!stored.includes(id)) {
      const updated = [...stored, id]
      setFavorites(updated)
      setFavoritesState(updated)
    }
  }, [])

  const removeFavorite = useCallback((id: number) => {
    const stored = getFavorites()
    const updated = stored.filter(favId => favId !== id)
    setFavorites(updated)
    setFavoritesState(updated)
  }, [])

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
  }
}
