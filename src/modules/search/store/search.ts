'use client'

import { create } from 'zustand'

export type FilterType = 'all' | 'artistOrCulture' | 'department'

interface SearchState {
  query: string
  departmentId: string
}

interface SearchActions {
  setQuery: (query: string) => void
  setDepartmentId: (departmentId: string) => void
}

type SearchStore = SearchState & SearchActions

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  departmentId: '',
  setQuery: (query) => set({ query: query.trim() }),
  setDepartmentId: (departmentId) => set({ departmentId }),
}))
