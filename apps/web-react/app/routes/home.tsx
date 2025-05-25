import { ArtworkService } from '@/services/artworks'
import { Header } from '~/components/header'
import { Gallery } from '~/gallery/gallery'
import type { Route } from './+types/home'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Art Gallery' },
    { name: 'description', content: 'Gallery from The Met Museum' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')

  if (search) {
    return (await ArtworkService.getByArtistOrCulture(search)) || []
  }

  return (await ArtworkService.getAll()) || []
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Header title="Art Gallery - The Met Museum" />
      <Gallery objectIds={loaderData} />
    </>
  )
}
