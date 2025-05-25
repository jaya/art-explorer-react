'use client'

import { Header } from '~/components/header'
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
    <>
      <Header title="Art Explorer - My Favorites" />
      <Gallery objectIds={favorites} />
    </>
  )
}
