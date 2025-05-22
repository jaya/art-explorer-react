/** @jest-environment jsdom */

import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { act, renderHook } from "@testing-library/react";
import { useFavoritesGalleryLogic } from "../useFavoritesGalleryLogic";

jest.mock("@/stores/favoritesStore", () => ({
  useFavoritesStore: jest.fn(),
}));

const mockArtwork: Artwork = {
  objectID: 1,
  title: "Favorite Artwork 1",
  primaryImage: "fav-image1.jpg",
  artistDisplayName: "Fav Artist 1",
  department: "Fav Department",
  medium: "Fav Medium",
  objectDate: "2023",
  dimensions: "10x10",
  creditLine: "Fav Credit",
  objectURL: "http://fav.url/1",
  primaryImageSmall: "fav-image1-small.jpg",
  isHighlight: false,
  accessionNumber: "FAV123",
};

const mockArtwork2: Artwork = {
  objectID: 2,
  title: "Favorite Artwork 2",
  primaryImage: "fav-image2.jpg",
  artistDisplayName: "Fav Artist 2",
  department: "Fav Department 2",
  medium: "Fav Medium 2",
  objectDate: "2024",
  dimensions: "20x20",
  creditLine: "Fav Credit 2",
  objectURL: "http://fav.url/2",
  primaryImageSmall: "fav-image2-small.jpg",
  isHighlight: true,
  accessionNumber: "FAV456",
};

describe("useFavoritesGalleryLogic", () => {
  let internalFavoritesMap: Map<number, Artwork>;
  let removeFavoriteMock: jest.Mock;
  let isFavoriteMock: jest.Mock;
  let saveFavoriteArtworkMock: jest.Mock;
  let getFavoriteArtworksArrayMock: jest.Mock;

  beforeEach(() => {
    internalFavoritesMap = new Map<number, Artwork>();

    removeFavoriteMock = jest.fn((artworkId: number) => {
      internalFavoritesMap.delete(artworkId);
    });

    isFavoriteMock = jest.fn((artworkId: number) =>
      internalFavoritesMap.has(artworkId)
    );

    saveFavoriteArtworkMock = jest.fn((artwork: Artwork) => {
      internalFavoritesMap.set(artwork.objectID, artwork);
    });

    getFavoriteArtworksArrayMock = jest.fn(() =>
      Array.from(internalFavoritesMap.values())
    );

    (useFavoritesStore as unknown as jest.Mock).mockImplementation(() => ({
      favoriteArtworks: Array.from(internalFavoritesMap.values()),
      removeFavorite: removeFavoriteMock,
      isFavorite: isFavoriteMock,
      saveFavoriteArtwork: saveFavoriteArtworkMock,
      getFavoriteArtworksArray: getFavoriteArtworksArrayMock,
    }));
  });

  test("deve retornar uma lista vazia de favoritos inicialmente", () => {
    const { result } = renderHook(() => useFavoritesGalleryLogic());
    expect(result.current.favoriteArtworks).toEqual([]);
  });

  test("deve retornar a lista de obras favoritas da store", () => {
    internalFavoritesMap.set(mockArtwork.objectID, mockArtwork);
    internalFavoritesMap.set(mockArtwork2.objectID, mockArtwork2);

    const { result } = renderHook(() => useFavoritesGalleryLogic());

    expect(result.current.favoriteArtworks).toHaveLength(2);
    expect(result.current.favoriteArtworks).toContainEqual(mockArtwork);
    expect(result.current.favoriteArtworks).toContainEqual(mockArtwork2);
  });

  test("deve chamar removeFavorite da store ao remover um favorito", () => {
    internalFavoritesMap.set(mockArtwork.objectID, mockArtwork); 

    const { result } = renderHook(() => useFavoritesGalleryLogic());
    act(() => {
      result.current.handleRemoveFavorite(mockArtwork.objectID);
    });
    expect(removeFavoriteMock).toHaveBeenCalledWith(mockArtwork.objectID);
    // Verifica se o item foi removido do map interno
    expect(internalFavoritesMap.has(mockArtwork.objectID)).toBe(false);
  });

  test("deve retornar isFavorite corretamente", () => {
    internalFavoritesMap.set(mockArtwork.objectID, mockArtwork);

    expect(isFavoriteMock(mockArtwork.objectID)).toBe(true);
    expect(isFavoriteMock(999)).toBe(false);
    expect(isFavoriteMock).toHaveBeenCalledWith(mockArtwork.objectID);
    expect(isFavoriteMock).toHaveBeenCalledWith(999);
  });
});
