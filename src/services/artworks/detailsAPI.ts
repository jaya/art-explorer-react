// src/services/artworks/detailsAPI.ts
import { API_BASE_URL } from "@/constants/apiConstants";
import { createApiError, createArtworkNotFoundError } from "@/lib/errors";
import type { Artwork } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getArtworkDetails = async (objectID: number): Promise<Artwork> => {
  try {
    const response = await axios.get<Artwork>(
      `${API_BASE_URL}/objects/${objectID}`
    );
    if (!response.data || !response.data.objectID) {
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

    throw createApiError(
      `An unexpected error occurred while fetching details for artwork ${objectID}.`,
      undefined,
      error
    );
  }
};

export const useArtworkDetails = (objectID: number | null, enabled = true) => {
  return useQuery<Artwork, Error>({
    queryKey: ["artwork", objectID],
    queryFn: async () => {
      if (objectID === null) {
        throw createApiError("objectID is null, cannot fetch artwork details.");
      }
      return getArtworkDetails(objectID);
    },
    enabled: !!objectID && enabled,
  });
};
