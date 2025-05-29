import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Artwork } from "../types/artwork";

interface FavoritesState {
  favoriteArtworks: Artwork[];
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  saveFavoriteArtwork: (artwork: Artwork) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteArtworks: [],

      saveFavoriteArtwork: (artwork: Artwork) => {
        const { favoriteArtworks } = get();
        if (
          !favoriteArtworks.some((art) => art.objectID === artwork.objectID)
        ) {
          set((state) => ({
            favoriteArtworks: [...state.favoriteArtworks, artwork],
          }));
        }
      },

      removeFavorite: (id: number) =>
        set((state) => ({
          favoriteArtworks: state.favoriteArtworks.filter(
            (art) => art.objectID !== id
          ),
        })),

      isFavorite: (id: number) =>
        get().favoriteArtworks.some((art) => art.objectID === id),

      clearFavorites: () => set({ favoriteArtworks: [] }),
    }),
    {
      name: "art-favorites-storage",
    }
  )
);
