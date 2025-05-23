import api from '../api'
import { endpoints } from './endpoints'
import type { DepartmentsResponse, ObjectDetail, SearchResponse } from './types'

export async function searchArtworks(query: string): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>(`${endpoints.search}?${query}`)
  return data
}

export async function getObjectDetail(id: number): Promise<ObjectDetail> {
  const { data } = await api.get<ObjectDetail>(endpoints.object(id))
  return data
}

export async function getDepartments() {
  const { data } = await api.get<DepartmentsResponse>(endpoints.departments)
  return data
}
