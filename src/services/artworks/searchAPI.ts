// src/services/artworks/searchAPI.ts
import { API_BASE_URL } from "@/constants/apiConstants"; // Importa a constante
import { createApiError, createSearchOperationFailedError } from "@/lib/errors"; // Importa as funções de erro
import type { SearchResponse } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const searchArtworks = async (
  query: string
): Promise<SearchResponse> => {
  if (!query) {
    return { total: 0, objectIDs: [] };
  }
  try {
    const response = await axios.get<SearchResponse>(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&hasImages=true`
    );

    return response.data || { total: 0, objectIDs: [] };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw createSearchOperationFailedError(query, error);
    }
    throw createApiError(
      `An unexpected error occurred during artwork search for query: "${query}".`,
      undefined,
      error
    );
  }
};

export const useSearchArtworks = (query: string, enabled = true) => {
  return useQuery<SearchResponse, Error, number[] | null>({
    queryKey: ["artworks", "search", query],
    queryFn: () => searchArtworks(query),
    enabled: !!query && enabled,
    select: (data) => data.objectIDs || [], 
  });
};
