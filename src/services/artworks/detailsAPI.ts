// src/services/artworks/detailsAPI.ts
import { API_BASE_URL } from "@/constants/apiConstants"; // Importa a constante
import { createApiError, createArtworkNotFoundError } from "@/lib/errors"; // Importa as funções de erro
import type { Artwork } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getArtworkDetails = async (objectID: number): Promise<Artwork> => {
  // Alterado para retornar Artwork ou lançar erro
  try {
    const response = await axios.get<Artwork>(
      `${API_BASE_URL}/objects/${objectID}`
    );
    if (!response.data || !response.data.objectID) {
      // Checagem adicional
      throw createArtworkNotFoundError(objectID);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw createArtworkNotFoundError(objectID);
      }
      throw createApiError(
        `Error fetching details for artwork ${objectID}: ${error.message}`,
        error.response?.status,
        error
      );
    }
    // Para erros não Axios, ou erros inesperados
    throw createApiError(
      `An unexpected error occurred while fetching details for artwork ${objectID}.`,
      undefined,
      error
    );
  }
};

// Hook para buscar detalhes de uma obra pelo ID
export const useArtworkDetails = (objectID: number | null, enabled = true) => {
  return useQuery<Artwork, Error>({
    // Especifica o tipo de erro
    queryKey: ["artwork", objectID],
    queryFn: async () => {
      if (objectID === null) {
        // Lançar um erro específico ou retornar null/undefined se o hook deve lidar com isso.
        // Por ora, vamos assumir que um ID nulo não deveria chamar queryFn devido ao 'enabled'.
        // Se chegar aqui, é um estado inesperado.
        throw createApiError("objectID is null, cannot fetch artwork details.");
      }
      return getArtworkDetails(objectID);
    },
    enabled: !!objectID && enabled,
  });
};
