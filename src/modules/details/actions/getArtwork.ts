'use server'

import { API } from '~/shared/helpers/api'
import { handleError } from '~/shared/helpers/errorHandler'
import type { Artwork } from '~/shared/types'

interface GetArtworkPayload {
  objectID: number
}

export async function getArtwork({ objectID }: GetArtworkPayload): Promise<Artwork | null> {
  try {
    const { data } = await API.get<Artwork>(`/objects/${objectID}`)

    return data
  } catch (error) {
    handleError(error, 'getArtwork')

    return null
  }
}
