import API from '@/http-client/API'
import type { Artwork, ArtworkItem, Department } from '@art-explorer/core'

export const ArtworkService = {
  async getArtworks(query?: string, departmentId?: number, page = 1) {
    try {
      const params = new URLSearchParams()
      if (query) params.append('query', query)
      if (departmentId) params.append('departmentId', departmentId.toString())
      params.append('page', String(page))

      const { data } = await API.get<{
        artworks: ArtworkItem[]
        hasMore: boolean
      }>(`/artworks?${params}`)
      return data
    } catch (error) {
      console.error('Error to get objectIDs', error)
      return {
        artworks: [],
        hasMore: false,
      }
    }
  },
  async getById(id: number): Promise<Artwork> {
    try {
      const { data } = await API.get<{ artwork: Artwork }>(`/artworks/${id}`)
      return data.artwork
    } catch (error) {
      console.error(`Error to get artwork ${id}:`, error)
      throw error
    }
  },
  async getDepartments(): Promise<Department[]> {
    try {
      const { data } = await API.get<{ departments: Department[] }>(
        '/departments'
      )
      return data.departments
    } catch (error) {
      console.error('Error to get objectIDs', error)
      return []
    }
  },
}
