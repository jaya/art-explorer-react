'use client'

import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { ArtworksContent } from '~/modules/artworks/views/components/ArtworksContent'

import { useClient } from '~/shared/hooks/useClient'

interface ArtworksListProps {
  initialData: FetchArtworksResponse
}

export function ArtworksList({ initialData }: ArtworksListProps) {
  const { isReady } = useClient()

  if (!isReady) return null

  return <ArtworksContent initialData={initialData} />
}
