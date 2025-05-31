import { SearchView } from '~/modules/search/views'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams
  const query = params.query

  if (query) {
    return {
      title: `Search: ${query} | Art Explorer`,
      description: `Search for art with the Met Museum API for ${query}`,
    }
  }

  return {
    title: 'Search | Art Explorer',
    description: 'Search for art with the Met Museum API',
  }
}

export default async function Page() {
  return <SearchView />
}
