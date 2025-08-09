import { create } from "zustand";
import { MetArtwork, Department } from "@/lib/types";

interface ArtworkStore {
  searchQuery: string;
  searchResults: number[];
  loadedArtworks: Map<number, MetArtwork>;
  displayedArtworkIds: number[];
  isSearching: boolean;
  searchError: string | null;

  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;

  selectedDepartment: number | null;
  departments: Department[];

  setSearchQuery: (query: string) => void;
  setSearchResults: (results: number[]) => void;
  setIsSearching: (loading: boolean) => void;
  setSearchError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setSelectedDepartment: (departmentId: number | null) => void;
  setDepartments: (departments: Department[]) => void;
  cacheArtwork: (artwork: MetArtwork) => void;
  getCachedArtwork: (objectID: number) => MetArtwork | undefined;
  resetSearch: () => void;
  loadMore: () => void;
  addDisplayedArtworks: (artworkIds: number[]) => void;
}

export const useArtworkStore = create<ArtworkStore>((set, get) => ({
  searchQuery: "",
  searchResults: [],
  loadedArtworks: new Map(),
  displayedArtworkIds: [],
  isSearching: false,
  searchError: null,
  currentPage: 1,
  itemsPerPage: 15,
  hasMore: true,
  selectedDepartment: null,
  departments: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) =>
    set({
      searchResults: results,
      hasMore: results.length > get().itemsPerPage,
    }),
  setIsSearching: (loading) => set({ isSearching: loading }),
  setSearchError: (error) => set({ searchError: error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedDepartment: (departmentId) =>
    set({ selectedDepartment: departmentId }),
  setDepartments: (departments) => set({ departments }),

  cacheArtwork: (artwork) => {
    const cache = get().loadedArtworks;
    cache.set(artwork.objectID, artwork);
    set({ loadedArtworks: new Map(cache) });
  },

  getCachedArtwork: (objectID) => {
    return get().loadedArtworks.get(objectID);
  },

  resetSearch: () =>
    set({
      currentPage: 1,
      displayedArtworkIds: [],
      hasMore: true,
      searchError: null,
    }),

  loadMore: () => {
    const { currentPage, searchResults, displayedArtworkIds } = get();
    const nextPage = currentPage + 1;
    const totalDisplayed = displayedArtworkIds.length;

    set({
      currentPage: nextPage,
      hasMore: totalDisplayed < searchResults.length,
    });
  },

  addDisplayedArtworks: (artworkIds) => {
    const { displayedArtworkIds, searchResults } = get();
    const newDisplayedIds = [...displayedArtworkIds, ...artworkIds];

    set({
      displayedArtworkIds: newDisplayedIds,
      hasMore: newDisplayedIds.length < searchResults.length,
    });
  },
}));
