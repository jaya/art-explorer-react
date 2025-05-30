import type { Metadata } from 'next'

import { ArtworksView } from '~/modules/artworks/views'

export const metadata: Metadata = {
  title: 'Art Explorer',
  description: 'Explore the world of art with the Met Museum API',
}

export default function Page() {
  return <ArtworksView />
}
