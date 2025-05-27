import { ARTWORKS_URL, DEPARTMENTS_URL } from '@/constants/met-museum.js'
import type {
  Artwork,
  ArtworkItem,
  Department,
  SearchArtworksResponse,
} from '@art-explorer/core'
import { LRUCache } from 'lru-cache'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

type SearchResponse = {
  total: number
  objectIDs: number[]
}

const objectIdsCache = new LRUCache<string, SearchResponse>({
  max: 50,
  ttl: 1000 * 60 * 60,
}) // 1h
const artworkCache = new LRUCache<number, Artwork>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24,
}) // 24h
const departmentsCache = new LRUCache<string, Department[]>({
  max: 1,
  ttl: 1000 * 60 * 60 * 24 * 7,
}) // 7d

export const MetService = {
  async search(
    query?: string,
    departmentId?: number,
    page = 1,
    limit = 15
  ): Promise<SearchArtworksResponse> {
    const cacheKey = `${query || 'painting'}:${departmentId || 'all'}`
    let data = objectIdsCache.get(cacheKey)
    if (!data) {
      const params = new URLSearchParams()
      if (query) params.append('artistOrCulture', 'true')
      params.append('hasImages', 'true')
      if (departmentId) params.append('departmentId', departmentId.toString())
      params.append('q', query || 'painting')
      console.log('fetching in met museum api')
      console.log(`${BASE_URL}/search?${params}`)
      const res = await fetch(`${BASE_URL}/search?${params}`)
      data = await res.json()
      objectIdsCache.set(cacheKey, data)
    }

    const { total, objectIDs } = objectIdsCache.get(cacheKey) || {
      total: 0,
      objectIDs: [],
    }
    const hasMore = total > page * limit
    return {
      hasMore,
      objectIDs: objectIDs.slice((page - 1) * limit, page * limit),
    }
  },

  async getById(id: number): Promise<Artwork> {
    if (artworkCache.has(id)) {
      const data = artworkCache.get(id)
      if (data) return data
    }

    console.log('fetching in met museum api - artwork')
    console.log(`${BASE_URL}/objects/${id}`)
    const res = await fetch(`${BASE_URL}${ARTWORKS_URL}/${id}`)
    if (!res.ok) throw new Error('Artwork not found')

    const data: Artwork = await res.json()
    artworkCache.set(id, data)
    return data
  },

  mapToListItem(art: Artwork): ArtworkItem {
    return {
      objectID: art.objectID,
      primaryImage: art.primaryImageSmall,
      title: art.title,
    }
  },

  async getDepartments() {
    if (departmentsCache.has('departments')) {
      const data = departmentsCache.get('departments')
      if (data) return data
    }
    console.log('fetching in met museum api - departments')
    console.log(`${BASE_URL}${DEPARTMENTS_URL}`)
    const res = await fetch(`${BASE_URL}${DEPARTMENTS_URL}`)
    if (!res.ok) throw new Error('Departments not found')
    const departments: Department[] = await res.json()

    departmentsCache.set('departments', departments)
    return departments
  },
}
