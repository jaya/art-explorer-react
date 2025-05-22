// src/services/artworks/searchAPI.ts
import { API_BASE_URL } from "@/constants/apiConstants"; // Importa a constante
import { createApiError, createSearchOperationFailedError } from "@/lib/errors"; // Importa as funções de erro
import type { SearchResponse } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Função base da API
export const searchArtworks = async (
  query: string
): Promise<SearchResponse> => {
  if (!query) {
    // Adiciona verificação para query vazia
    // Retorna uma resposta vazia válida se a query for vazia,
    // ou pode lançar um erro se uma query for sempre esperada.
    // console.warn("Search query is empty. Returning empty results.");
    return { total: 0, objectIDs: [] };
  }
  try {
    const response = await axios.get<SearchResponse>(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&hasImages=true` // Usa encodeURIComponent
    );
    // A API de busca retorna um objeto com total e objectIDs (pode ser null)
    // Mesmo que a busca não encontre nada, ela retorna total: 0 e objectIDs: null, o que não é um erro.
    return response.data || { total: 0, objectIDs: [] }; // Garante que objectIDs nunca seja null
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

// Hook para buscar obras por termo de pesquisa (retorna apenas IDs)
export const useSearchArtworks = (query: string, enabled = true) => {
  return useQuery<SearchResponse, Error, number[] | null>({
    // Especifica o tipo de erro e o tipo selecionado
    queryKey: ["artworks", "search", query],
    queryFn: () => searchArtworks(query),
    enabled: !!query && enabled,
    select: (data) => data.objectIDs || [], // Garante que objectIDs seja um array
  });
};
