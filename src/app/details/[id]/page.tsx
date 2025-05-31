import type { Metadata } from 'next'

import { getArtwork } from '~/modules/details/actions/getArtwork'
import { DetailsView } from '~/modules/details/views'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const artwork = await getArtwork({ objectID: Number(id) })

  return {
    title: `Details of ${artwork.title} | Art Explorer`,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <DetailsView id={id} />
}
