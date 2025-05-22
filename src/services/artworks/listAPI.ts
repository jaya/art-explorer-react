// src/services/artworks/listAPI.ts
import {
  DEFAULT_SEARCH_TERM,
  ITEMS_PER_PAGE,
} from "@/constants/galleryConstants";
import {
  createMultipleArtworksFetchError,
  isArtworkNotFoundError,
} from "@/lib/errors";
import type { Artwork } from "@/types/artwork";
import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query"; // Importa QueryKey
import { getArtworkDetails } from "./detailsAPI";
import { searchArtworks } from "./searchAPI";

// Função para buscar vários detalhes de obras de arte em paralelo
export const getMultipleArtworkDetails = async (
  objectIDs: number[]
): Promise<Artwork[]> => {
  if (!objectIDs || objectIDs.length === 0) {
    return [];
  }

  const artworkPromises = objectIDs.map((id) =>
    getArtworkDetails(id).catch((error) => {
      if (isArtworkNotFoundError(error)) {
        return null;
      }
      throw error;
    })
  );

  const results = await Promise.allSettled(artworkPromises);

  const artworks: Artwork[] = [];
  const errorsEncountered: unknown[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      if (result.value) {
        artworks.push(result.value);
      }
    } else if (result.status === "rejected") {
      errorsEncountered.push(result.reason);
    }
  });

  if (
    errorsEncountered.length > 0 &&
    artworks.length === 0 &&
    objectIDs.length > 0
  ) {
    throw createMultipleArtworksFetchError(
      `Failed to fetch details for all ${objectIDs.length} artworks.`,
      errorsEncountered // Passa os erros encontrados
    );
  }

  return artworks;
};

interface InfiniteArtworksData {
  artworks: Artwork[];
  nextPageCursor?: number;
}

// Hook para buscar múltiplas obras com paginação infinita
export const useInfiniteArtworks = (
  query: string,
  departmentId?: string | null
) => {
  return useInfiniteQuery<
    InfiniteArtworksData, // TQueryFnData: Tipo do que queryFn retorna
    Error, // TError: Tipo do erro
    InfiniteArtworksData, // TData: Tipo dos dados da página (geralmente igual a TQueryFnData)
    QueryKey, // TQueryKey: Tipo da chave da query. `QueryKey` é `readonly unknown[]`
    number // TPageParam: Tipo do parâmetro da página
  >({
    queryKey: ["artworks", "infinite", query, departmentId], // Este é o QueryKey
    queryFn: async ({ pageParam = 0 }) => {
      // pageParam é explicitamente number aqui por causa de initialPageParam e getNextPageParam
      const currentStartIndex: number = pageParam;

      const searchQuery = query || DEFAULT_SEARCH_TERM; // Usa constante

      const searchResult = await searchArtworks(searchQuery);
      const allObjectIDs = searchResult.objectIDs || [];

      const pageIds = allObjectIDs.slice(
        currentStartIndex,
        currentStartIndex + ITEMS_PER_PAGE // Usa constante correta
      );
      const artworksData = await getMultipleArtworkDetails(pageIds);

      const hasMore = currentStartIndex + ITEMS_PER_PAGE < allObjectIDs.length;
      const nextPageCursor = hasMore
        ? currentStartIndex + ITEMS_PER_PAGE
        : undefined;

      return {
        artworks: artworksData,
        nextPageCursor,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
    enabled: !!(query || DEFAULT_SEARCH_TERM), // Garante que haja uma query
  });
};
