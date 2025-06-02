'use server'

import { getArtwork } from '~/modules/details/actions/getArtwork'
import { API } from '~/shared/helpers/api'
import { handleError } from '~/shared/helpers/errorHandler'
import { logDomainAction } from '~/shared/helpers/logger'
import type { Artwork } from '~/shared/types'

export interface FetchArtworksPayload {
  page: number
}

export interface FetchArtworksResponse {
  data: Artwork[]
  nextPage: number | null
}

export interface ApiResponse {
  total: number
  objectIDs: string[]
}

const LIMIT = 15
const DEFAULT_QUERY = 'paintings'
const MAX_ATTEMPTS = 30

export async function fetchArtworks({ page }: FetchArtworksPayload) {
  try {
    logDomainAction('artworks', 'fetchList', { page })

    const { data: artworksIds } = await API.get<ApiResponse>('/search', {
      params: {
        hasImages: true,
        q: DEFAULT_QUERY,
      },
    })

    if (!artworksIds.objectIDs || artworksIds.objectIDs.length === 0) {
      return {
        data: [],
        nextPage: null,
      }
    }

    const startIndex = (page - 1) * LIMIT
    const validArtworks: Artwork[] = []
    let currentIndex = startIndex
    let attempts = 0

    while (validArtworks.length < LIMIT && currentIndex < artworksIds.objectIDs.length && attempts < MAX_ATTEMPTS) {
      const batchSize = Math.min(LIMIT - validArtworks.length + 5, artworksIds.objectIDs.length - currentIndex)
      const batch = artworksIds.objectIDs.slice(currentIndex, currentIndex + batchSize)

      const promises = batch.map((objectID) => getArtwork({ objectID: Number(objectID) }))
      const results = await Promise.allSettled(promises)

      const batchArtworks = results
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<Artwork | null>).value)
        .slice(0, LIMIT - validArtworks.length)

      validArtworks.push(...batchArtworks)
      currentIndex += batchSize
      attempts += batchSize
    }

    return {
      data: validArtworks,
      nextPage: currentIndex < artworksIds.objectIDs.length ? page + 1 : null,
    }
  } catch (error) {
    handleError(error, 'fetchArtworks')

    return {
      data: [],
      nextPage: null,
    }
  }
}
