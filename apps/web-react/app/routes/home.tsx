import { ArtworkService } from '@/services/artworks'
import { Gallery } from '~/gallery/gallery'
import type { Route } from './+types/home'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Art Gallery' },
    { name: 'description', content: 'Gallery from The Met Museum' },
  ]
}

export async function loader() {
  const objectIds = await ArtworkService.getAll()
  return objectIds.slice(0, 1000)
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1 className="text-center w-full text-2xl">
        Art Explorer - The Met Museum
      </h1>
      <Gallery objectIds={loaderData} />
    </>
  )
}
