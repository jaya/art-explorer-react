import { getArtwork } from '~/modules/details/actions/getArtwork'
import { ArtworkDetail } from '~/modules/details/views/components/ArtworkDetails'

interface DetailsViewProps {
  id: string
}

export async function DetailsView({ id }: DetailsViewProps) {
  const artwork = await getArtwork({ objectID: Number(id) })

  return <ArtworkDetail artwork={artwork} />
}
