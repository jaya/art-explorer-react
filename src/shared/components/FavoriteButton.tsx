'use client'

import { HeartMinus, HeartPlus } from 'lucide-react'

import type { Artwork } from '~/modules/artworks/types'
import { useFavorites } from '~/modules/favorites/hooks/useFavorites'
import { useFavoriteStore } from '~/modules/favorites/store/favorite'

interface FavoriteButtonProps {
  artwork: Artwork
}

export function FavoriteButton({ artwork }: FavoriteButtonProps) {
  const isFavorite = useFavoriteStore((state) => state.isFavorite(artwork))
  const addFavorite = useFavoriteStore((state) => state.addFavorite)
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite)

  const { isReady } = useFavorites()

  const handleClick = () => {
    if (isFavorite) {
      removeFavorite(artwork)
    } else {
      addFavorite(artwork)
    }
  }

  if (!isReady) return null

  return (
    <button
      className="cursor-pointer rounded-full bg-background p-2 transition-colors duration-300 hover:bg-primary"
      onClick={handleClick}
      type="button">
      <span className="sr-only">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
      {isFavorite ? <HeartMinus className="stroke-3" /> : <HeartPlus className="stroke-3" />}
    </button>
  )
}
