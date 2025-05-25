'use client'

import { Gallery } from '~/gallery/gallery'
import { useFavorites } from '~/hooks/use-favorites'
import type { Route } from './+types/favorites'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Art Gallery - Favorites' },
    { name: 'description', content: 'Gallery from The Met Museum' },
  ]
}

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <div suppressHydrationWarning>
      <h1 className="text-center w-full text-2xl">
        Art Explorer - The Met Museum - My Favorites
      </h1>
      <Gallery objectIds={favorites} />
    </div>
  )
}
