import { Gallery } from '@/app/gallery'
import { fetchObjectIDs } from '@/services/artworks'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const objectIDs = await fetchObjectIDs()

  // just for now for test
  const limitedIds = objectIDs.slice(0, 1000)
  return (
    <div>
      <h1 className="text-center w-full text-2xl">
        Art Explorer - The Met Museum
      </h1>
      <Gallery objectIds={limitedIds} />
    </div>
  )
}
