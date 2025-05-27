'use server'

import { getArtwork } from '~/modules/artworks/actions/getArtwork'
import type { Artwork } from '~/modules/artworks/types'
import { API } from '~/shared/helpers/api'

interface FetchPayload {
  page: number
}

interface FetchResponse {
  data: Artwork[]
  nextPage: number | null
}

interface ApiResponse {
  total: number
  objectIDs: string[]
}

const LIMIT = 15

export async function fetchArtworks({ page }: FetchPayload): Promise<FetchResponse> {
  const { data: artworksIds } = await API.get<ApiResponse>('/search', {
    params: {
      hasImages: true,
      q: 'painting',
    },
  })

  const slice = artworksIds.objectIDs.slice((page - 1) * LIMIT, page * LIMIT)
  const promises = slice.map((objectID) => getArtwork({ objectID: Number(objectID) }))

  const results = await Promise.allSettled(promises)
  const data = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)

  return {
    data,
    nextPage: artworksIds.total > page * LIMIT ? page + 1 : null,
  }
}
