'use server'

import type { Artwork } from '~/modules/artworks/types'
import { API } from '~/shared/helpers/api'

interface GetArtworkPayload {
  objectID: number
}

export async function getArtwork({ objectID }: GetArtworkPayload) {
  const { data: artwork } = await API.get<Artwork>(`/objects/${objectID}`)

  return artwork
}
