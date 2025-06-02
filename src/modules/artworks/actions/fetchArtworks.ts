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
const DEFAULT_QUERY = '*'

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
    const endIndex = startIndex + LIMIT
    const paginatedIds = artworksIds.objectIDs.slice(startIndex, endIndex)

    const promises = paginatedIds.map((objectID) => getArtwork({ objectID: Number(objectID) }))
    const results = await Promise.allSettled(promises)
    const data = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)

    return {
      data,
      nextPage: endIndex < artworksIds.objectIDs.length ? page + 1 : null,
    }
  } catch (error) {
    handleError(error, 'fetchArtworks')

    return {
      data: [],
      nextPage: null,
    }
  }
}
