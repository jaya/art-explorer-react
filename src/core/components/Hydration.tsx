'use client'

import { useEffect } from 'react'

import { useFavoriteStore } from '~/modules/favorites/store/favorite'

export function Hydration() {
  useEffect(() => {
    useFavoriteStore.persist.rehydrate()
  }, [])

  return null
}
