'use server'

import { getArtwork } from '~/modules/details/actions/getArtwork'
import { API } from '~/shared/helpers/api'
import { handleError } from '~/shared/helpers/errorHandler'
import { logDomainAction } from '~/shared/helpers/logger'
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
  try {
    logDomainAction('search', 'query', { query, type: searchType, department: departmentId, page })

    const { data: artworksIds } = await API.get<ApiResponse>('/search', {
      params: {
        hasImages: true,
        artistOrCulture: searchType === 'artistOrCulture' ? true : undefined,
        departmentId: searchType === 'department' ? departmentId : undefined,
        q: query || '*',
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
    handleError(error, 'fetchSearch')

    return {
      data: [],
      nextPage: null,
    }
  }
}
