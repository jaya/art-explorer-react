import { fetchArtworks } from '~/modules/artworks/actions/fetchArtworks'
import { ArtworksList } from '~/modules/artworks/views/components/ArtworksList'

export async function ArtworksView() {
  const initialData = await fetchArtworks({ page: 1 })

  return <ArtworksList initialData={initialData} />
}
