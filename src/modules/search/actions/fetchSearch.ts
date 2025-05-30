'use server'

import { getArtwork } from '~/modules/details/actions/getArtwork'
import { API } from '~/shared/helpers/api'
import type { Artwork, SearchType } from '~/shared/types'

export interface FetchSearchPayload {
  page: number
  query?: string
  searchType?: SearchType
  departmentId?: string
}

export interface FetchSearchResponse {
  data: Artwork[]
  nextPage: number | null
}

export interface ApiResponse {
  total: number
  objectIDs: string[]
}

const LIMIT = 15

export async function fetchSearch({ page, query, searchType, departmentId }: FetchSearchPayload) {
  const { data: artworksIds } = await API.get<ApiResponse>('/search', {
    params: {
      hasImages: true,
      artistOrCulture: searchType === 'artistOrCulture' ? true : undefined,
      departmentId: searchType === 'department' ? departmentId : undefined,
      q: query,
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
