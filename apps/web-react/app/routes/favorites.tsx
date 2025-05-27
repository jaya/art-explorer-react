'use client'

import { Header } from '~/components/header'
import { GalleryFavorites } from '~/gallery/gallery-favorites'
import { useFavorites } from '~/hooks/use-favorites'
import type { Route } from './+types/favorites'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Art GalleryFavorites - Favorites' },
    { name: 'description', content: 'GalleryFavorites from The Met Museum' },
  ]
}

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <>
      <Header title="Art Explorer - My Favorites" />
      <GalleryFavorites objectIds={favorites} />
    </>
  )
}
