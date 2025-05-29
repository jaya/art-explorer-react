'use client'

import { create } from 'zustand'

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
