/** @jest-environment jsdom */
import { DEFAULT_SEARCH_TERM } from "@/constants/galleryConstants";
import { useInfiniteArtworks } from "@/services/artworks";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { act, renderHook } from "@testing-library/react";
import { useArtworkGalleryLogic } from "../useArtworkGalleryLogic";

jest.mock("@/services/artworks", () => ({
  useInfiniteArtworks: jest.fn(),
}));

jest.mock("@/stores/favoritesStore", () => ({
  useFavoritesStore: jest.fn(),
}));

jest.useFakeTimers();

describe("useArtworkGalleryLogic", () => {
  const mockArtwork: Artwork = {
    objectID: 1,
    title: "Test Artwork",
    primaryImage: "test-image.jpg",
    artistDisplayName: "Test Artist",
    department: "Paintings",
    medium: "Oil on canvas",
    objectDate: "2023",
    dimensions: "100 x 100 cm",
    creditLine: "Test Museum",
    objectURL: "https://test.com/artwork/1",
    primaryImageSmall: "test-image-small.jpg",
    isHighlight: false,
    accessionNumber: "12345",
  };

  const mockArtworkPage = {
    artworks: [mockArtwork],
    nextPageCursor: 2,
  };

  const baseMockUseInfiniteArtworks = {
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isPending: false,
    error: null,
    isError: false,
  };

  const mockUseFavoritesStore = {
    removeFavorite: jest.fn(),
    isFavorite: jest.fn(),
    saveFavoriteArtwork: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useInfiniteArtworks as jest.Mock).mockReturnValue({
      ...baseMockUseInfiniteArtworks,
      data: { pages: [mockArtworkPage], pageParams: [null] },
    });
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue(
      mockUseFavoritesStore
    );
  });

  test("deve inicializar com valores padrão", () => {
    (useInfiniteArtworks as jest.Mock).mockReturnValue({
      ...baseMockUseInfiniteArtworks,
      data: { pages: [mockArtworkPage], pageParams: [null] },
      hasNextPage: true,
      isPending: false,
    });
    const { result } = renderHook(() => useArtworkGalleryLogic());

    expect(result.current.searchTerm).toBe(DEFAULT_SEARCH_TERM);
    expect(result.current.artworksToRender).toHaveLength(1);
    expect(result.current.artworksToRender[0]).toEqual(mockArtwork);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showLoadMoreButton).toBe(true);
    expect(result.current.selectedDepartment).toBe(null);
  });

  test("deve permitir busca por artworks e atualizar searchTerm após debounce", () => {

    const { result } = renderHook(() => useArtworkGalleryLogic());
    const newSearchTerm = "Van Gogh";

    act(() => {
      result.current.handleSearch(newSearchTerm);
    });

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(result.current.searchTerm).toBe(newSearchTerm);
    expect(useInfiniteArtworks).toHaveBeenLastCalledWith(newSearchTerm, null);
  });

  test("deve selecionar e fechar detalhes de uma obra de arte", () => {
    const { result } = renderHook(() => useArtworkGalleryLogic());

    act(() => {
      result.current.handleArtworkClick(mockArtwork);
    });

    expect(result.current.selectedArtwork).toEqual(mockArtwork);

    act(() => {
      result.current.handleCloseDetails();
    });

    expect(result.current.selectedArtwork).toBeNull();
  });
});
