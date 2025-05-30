import type { Metadata } from 'next'

import { SearchView } from '~/modules/search/views'

export const metadata: Metadata = {
  title: 'Search | Art Explorer',
  description: 'Search for art with the Met Museum API',
}

export default async function Page() {
  return <SearchView />
}
