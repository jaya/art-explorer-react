import { create } from 'zustand'
import type { SearchMode } from '../components/SearchModeToggle'

export interface SearchState {
  query: string
  mode: SearchMode
  departmentId: number | null
  setQuery: (q: string) => void
  setMode: (mode: SearchMode) => void
  setDepartmentId: (id: number | null) => void
  searchParams: string
  setSearchParams: (params: string) => void
  reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  mode: 'object',
  departmentId: null,
  searchParams: '',
  setSearchParams: (params) => set({ searchParams: params }),
  setQuery: (query) => set({ query }),
  setMode: (mode) => set({ mode, query: '' }),
  setDepartmentId: (id) => set({ departmentId: id }),
  reset: () => set({ query: '', mode: 'artist', departmentId: null }),
}))
