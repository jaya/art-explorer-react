import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Artwork } from "../types/artwork";

interface FavoritesState {
  favorites: number[];
  favoriteArtworks: Artwork[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  saveFavoriteArtwork: (artwork: Artwork) => void;
  clearFavorites: () => void;
}

// Store que persiste os favoritos no localStorage
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      favoriteArtworks: [],

      // Adiciona um ID aos favoritos
      addFavorite: (id: number) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),

      // Remove um ID dos favoritos
      removeFavorite: (id: number) =>
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
          favoriteArtworks: state.favoriteArtworks.filter(
            (art) => art.objectID !== id
          ),
        })),

      // Verifica se um ID está nos favoritos
      isFavorite: (id: number) => get().favorites.includes(id),

      // Salva a obra completa quando o usuário favoritar
      saveFavoriteArtwork: (artwork: Artwork) => {
        const { favorites, favoriteArtworks } = get();

        // Se já existe este ID nos favoritos, mas não temos os dados completos
        if (
          favorites.includes(artwork.objectID) &&
          !favoriteArtworks.some((art) => art.objectID === artwork.objectID)
        ) {
          set((state) => ({
            favoriteArtworks: [...state.favoriteArtworks, artwork],
          }));
        }
        // Se não existe ainda nos favoritos
        else if (!favorites.includes(artwork.objectID)) {
          set((state) => ({
            favorites: [...state.favorites, artwork.objectID],
            favoriteArtworks: [...state.favoriteArtworks, artwork],
          }));
        }
      },

      // Limpa todos os favoritos
      clearFavorites: () => set({ favorites: [], favoriteArtworks: [] }),
    }),
    {
      name: "art-favorites-storage", // nome do item no localStorage
    }
  )
);
