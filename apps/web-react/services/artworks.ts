import {
  ARTS_BY_ARTIST_URL,
  ARTS_BY_DEPARTMENT_URL,
  ARTS_WITH_IMAGES_URL,
  ARTWORKS_URL,
  DEPARTMENTS_URL,
} from '@/constants/met-museum.constant'
import API from '@/http-client/API'
import type { Artwork } from '@/models/art'
import type { Department } from '@/models/department'

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

async function getByArtistOrCulture(artistOrCulture: string) {
  try {
    const { data } = await API.get<{ objectIDs: number[] }>(
      `${ARTS_BY_ARTIST_URL}${artistOrCulture}`
    )
    return data.objectIDs
  } catch (error) {
    console.error('Error to get objectIDs', error)
    return []
  }
}

async function getDepartments(): Promise<Department[]> {
  try {
    const { data } = await API.get<{ departments: Department[] }>(
      `${DEPARTMENTS_URL}`
    )
    return data.departments
  } catch (error) {
    console.error('Error to get objectIDs', error)
    return []
  }
}

async function getArtworksByDepartment(
  departmentId: number,
  search = 'portrait'
) {
  try {
    const { data } = await API.get<{ objectIDs: number[] }>(
      `${ARTS_BY_DEPARTMENT_URL}${departmentId}&q=${search}`
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
  getByArtistOrCulture,
  getDepartments,
  getArtworksByDepartment,
}
