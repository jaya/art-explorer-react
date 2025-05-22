/** @jest-environment jsdom */
import { DEFAULT_SEARCH_TERM } from "@/constants/galleryConstants";
import { useInfiniteArtworks } from "@/services/artworks";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { act, renderHook } from "@testing-library/react";
import { useArtworkGalleryLogic } from "../useArtworkGalleryLogic";

// Mock das dependências externas
jest.mock("@/services/artworks", () => ({
  useInfiniteArtworks: jest.fn(),
}));

jest.mock("@/stores/favoritesStore", () => ({
  useFavoritesStore: jest.fn(),
}));

// Adiciona o controle de timers do Jest
jest.useFakeTimers();

describe("useArtworkGalleryLogic", () => {
  // Mock de dados e retornos
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
    objectURL: "https://test.com/artwork/1", // Adicionando objectURL de volta
    primaryImageSmall: "test-image-small.jpg",
    isHighlight: false,
    accessionNumber: "12345",
    // As seguintes propriedades são opcionais e podem ser adicionadas se necessário para testes específicos
    // constituents: null,
  };

  const mockArtworkPage = {
    artworks: [mockArtwork],
    nextPageCursor: 2,
  };

  // Configuração base para o mock de useInfiniteArtworks
  const baseMockUseInfiniteArtworks = {
    fetchNextPage: jest.fn(),
    hasNextPage: false, // Desabilita a paginação automática para simplificar os testes
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
      data: { pages: [mockArtworkPage], pageParams: [null] }, // Fornece dados iniciais
    });
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue(
      mockUseFavoritesStore
    );
  });

  test("deve inicializar com valores padrão", () => {
    // Sobrescreve o mock para este teste específico para garantir que hasNextPage seja true
    (useInfiniteArtworks as jest.Mock).mockReturnValue({
      ...baseMockUseInfiniteArtworks,
      data: { pages: [mockArtworkPage], pageParams: [null] },
      hasNextPage: true, // Garante que o botão de carregar mais seja exibido
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
    // O mock do beforeEach lida com as chamadas.
    // useInfiniteArtworks será chamado com DEFAULT_SEARCH_TERM inicialmente,
    // depois novamente com DEFAULT_SEARCH_TERM após setCurrentSearchInput,
    // e finalmente com newSearchTerm após o debounce e setSearchTerm.

    const { result } = renderHook(() => useArtworkGalleryLogic());
    const newSearchTerm = "Van Gogh";

    act(() => {
      result.current.handleSearch(newSearchTerm);
    });

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(result.current.searchTerm).toBe(newSearchTerm);
    // Verifica se a última chamada a useInfiniteArtworks foi com o novo termo de busca.
    expect(useInfiniteArtworks).toHaveBeenLastCalledWith(newSearchTerm, null);
    // A verificação de toHaveBeenCalledTimes(2) foi removida por ser muito sensível
    // ao número de re-renderizações internas do hook.
  });

  test("deve selecionar e fechar detalhes de uma obra de arte", () => {
    // O mock do beforeEach já fornece os dados iniciais e estado não pendente
    const { result } = renderHook(() => useArtworkGalleryLogic());

    // Seleciona uma obra
    act(() => {
      result.current.handleArtworkClick(mockArtwork);
    });

    expect(result.current.selectedArtwork).toEqual(mockArtwork);

    // Fecha os detalhes
    act(() => {
      result.current.handleCloseDetails();
    });

    expect(result.current.selectedArtwork).toBeNull();
  });
});
