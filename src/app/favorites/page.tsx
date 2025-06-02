import type { Metadata } from 'next'

import { FavoritesView } from '~/modules/favorites/views'

export const metadata: Metadata = {
  title: 'Favorites | Art Explorer',
  description: 'Your favorite artworks',
}

export default function Page() {
  return <FavoritesView />
}
