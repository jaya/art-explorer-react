import {
  ARTS_WITH_IMAGES_URL,
  ARTWORKS_URL,
} from '@/constants/met-museum.constant'
import API from '@/http-client/API'
import type { Artwork } from '@/models/art'

async function getById(id: number) {
  try {
    const { data } = await API.get<Artwork>(`${ARTWORKS_URL}/${id}`)
    return data
  } catch (error) {
    console.error(`Error to get artwork ${id}:`, error)
    throw error
  }
}

async function getAll(): Promise<number[]> {
  try {
    const { data } = await API.get<{ objectIDs: number[] }>(
      `${ARTS_WITH_IMAGES_URL}`
    )
    return data.objectIDs
  } catch (error) {
    console.error('Error to get objectIDs', error)
    return []
  }
}

export const ArtworkService = {
  getAll,
  getById,
}
