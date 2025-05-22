import type { Artwork } from "@/types/artwork";
import { act } from "react-dom/test-utils";
import { useFavoritesStore } from "../favoritesStore";

const mockArtwork: Artwork = {
  objectID: 1,
  title: "Obra Teste",
  primaryImage: "img.jpg",
  artistDisplayName: "Artista",
  department: "Depto",
  medium: "Óleo",
  objectDate: "2024",
  dimensions: "10x10",
  creditLine: "Crédito",
  objectURL: "http://url",
  primaryImageSmall: "img-small.jpg",
  isHighlight: false,
  accessionNumber: "ACC123",
};

describe("useFavoritesStore", () => {
  beforeEach(() => {
    // Limpa os favoritos antes de cada teste
    useFavoritesStore.getState().clearFavorites();
  });

  it("adiciona e remove favoritos corretamente", () => {
    // Adiciona
    act(() => {
      useFavoritesStore.getState().saveFavoriteArtwork(mockArtwork);
    });
    expect(useFavoritesStore.getState().favoriteArtworks).toHaveLength(1);

    // Remove
    act(() => {
      useFavoritesStore.getState().removeFavorite(mockArtwork.objectID);
    });
    expect(useFavoritesStore.getState().favoriteArtworks).toHaveLength(0);
  });
});
