'use client'

import { create } from 'zustand'

export type FilterType = 'all' | 'artistOrCulture' | 'department'

interface SearchState {
  query: string
  filterType: FilterType
  departmentId: string
}

interface SearchActions {
  setQuery: (query: string) => void
  setFilterType: (filterType: FilterType) => void
  setDepartmentId: (departmentId: string) => void
}

type SearchStore = SearchState & SearchActions

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  filterType: 'all',
  departmentId: '',
  setQuery: (query) => set({ query: query.trim() }),
  setFilterType: (filterType) => set({ filterType }),
  setDepartmentId: (departmentId) => set({ departmentId }),
}))
