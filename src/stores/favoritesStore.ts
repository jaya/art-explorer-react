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

// Store que persiste os favoritos no localStorage
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteArtworks: [],

      // Adiciona a obra completa aos favoritos
      // Esta função agora é a única maneira de adicionar um favorito.
      saveFavoriteArtwork: (artwork: Artwork) => {
        const { favoriteArtworks } = get();
        // Só adiciona se já não existir para evitar duplicatas
        if (
          !favoriteArtworks.some((art) => art.objectID === artwork.objectID)
        ) {
          set((state) => ({
            favoriteArtworks: [...state.favoriteArtworks, artwork],
          }));
        }
      },

      // Remove um ID dos favoritos (e consequentemente a obra)
      removeFavorite: (id: number) =>
        set((state) => ({
          favoriteArtworks: state.favoriteArtworks.filter(
            (art) => art.objectID !== id
          ),
        })),

      // Verifica se um ID está nos favoritos olhando os IDs das obras salvas
      isFavorite: (id: number) =>
        get().favoriteArtworks.some((art) => art.objectID === id),

      // Limpa todos os favoritos
      clearFavorites: () => set({ favoriteArtworks: [] }),
    }),
    {
      name: "art-favorites-storage", // nome do item no localStorage
      // Opcional: migração se a estrutura do estado persistido mudou significativamente
      // migrate: (persistedState: unknown, version: number) => {
      //   if (version < YOUR_NEW_VERSION) {
      //     // Lógica de migração aqui
      //     // Ex: se o persistedState antigo tinha `favorites` (array de IDs)
      //     // e você precisa converter para a nova estrutura apenas com `favoriteArtworks`.
      //     // Isso é mais complexo e depende de como você quer tratar dados antigos.
      //     // Por agora, vamos assumir que uma limpeza do cache do usuário seria aceitável
      //     // ou que a estrutura não mudou drasticamente a ponto de quebrar.
      //   }
      //   return persistedState as FavoritesState;
      // },
      // version: YOUR_NEW_VERSION, // Incrementar se fizer migração
    }
  )
);
