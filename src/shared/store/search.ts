'use client'

import { create } from 'zustand'

interface SearchState {
  query: string
  isOpen: boolean
}

interface SearchActions {
  setQuery: (query: string) => void
  setIsOpen: (isOpen: boolean) => void
}

type SearchStore = SearchState & SearchActions

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  isOpen: false,
  setQuery: (query) => set({ query: query.trim() }),
  setIsOpen: (isOpen) => set({ isOpen }),
}))
