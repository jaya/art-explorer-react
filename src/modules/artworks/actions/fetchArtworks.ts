'use server'

import { getArtwork } from '~/modules/details/actions/getArtwork'
import { API } from '~/shared/helpers/api'
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
const DEFAULT_QUERY = 'painting'

export async function fetchArtworks({ page }: FetchArtworksPayload) {
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

  const slice = artworksIds.objectIDs.slice((page - 1) * LIMIT, page * LIMIT)
  const promises = slice.map((objectID) => getArtwork({ objectID: Number(objectID) }))

  const results = await Promise.allSettled(promises)
  const data = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)

  return {
    data,
    nextPage: artworksIds.total > page * LIMIT ? page + 1 : null,
  }
}
