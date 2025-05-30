import { SearchView } from '~/modules/search/views'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams
  const query = params.query

  return {
    title: `Search: ${params.query} | Art Explorer`,
    description: `Search for art with the Met Museum API for ${query}`,
  }
}

export default async function Page() {
  return <SearchView />
}
