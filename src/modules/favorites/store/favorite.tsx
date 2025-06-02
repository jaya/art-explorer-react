'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logDomainAction } from '~/shared/helpers/logger'

import type { Artwork } from '~/shared/types'

interface FavoriteState {
  favorites: Artwork[]
  isFavorite: (artwork: Artwork) => boolean
}

interface FavoriteActions {
  addFavorite: (artwork: Artwork) => void
  removeFavorite: (artwork: Artwork) => void
}

type FavoriteStore = FavoriteState & FavoriteActions

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (artwork) => get().favorites.some((favorite) => favorite.objectID === artwork.objectID),
      addFavorite: (artwork) => {
        logDomainAction('favorites', 'add', { artworkId: artwork.objectID, title: artwork.title })
        set({ favorites: [...get().favorites, artwork] })
      },
      removeFavorite: (artwork) => {
        logDomainAction('favorites', 'remove', { artworkId: artwork.objectID, title: artwork.title })
        set({ favorites: get().favorites.filter((favorite) => favorite.objectID !== artwork.objectID) })
      },
    }),
    {
      name: 'favorites',
      skipHydration: true,
    },
  ),
)
