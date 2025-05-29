'use server'

import { API } from '~/shared/helpers/api'
import type { Artwork } from '~/shared/types'

interface GetArtworkPayload {
  objectID: number
}

export async function getArtwork({ objectID }: GetArtworkPayload) {
  const { data } = await API.get<Artwork>(`/objects/${objectID}`)

  return data
}
