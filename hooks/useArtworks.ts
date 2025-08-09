import { useQuery } from "@tanstack/react-query";
import { EnhancedMetAPI } from "@/lib/api-enhanced";
import { useArtworkStore } from "@/stores/useArtworkStore";
import { FIVE_MINUTES, ONE_HOUR, TEN_MINUTES } from "@/lib/types";

export function useArtworkSearch() {
  const { searchQuery, selectedDepartment } = useArtworkStore();

  return useQuery({
    queryKey: ["artworks", "search", searchQuery, selectedDepartment],
    queryFn: async () => {
      return EnhancedMetAPI.searchArtworks(
        searchQuery || "painting",
        selectedDepartment || undefined,
      );
    },
    staleTime: FIVE_MINUTES,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useBatchArtworks(
  objectIDs: number[],
  enabled: boolean = true,
  targetCount: number = 15,
) {
  return useQuery({
    queryKey: [
      "artworks",
      "batch",
      objectIDs.slice(0, targetCount * 2).join(","),
      targetCount,
    ],
    queryFn: () => EnhancedMetAPI.batchLoadArtworks(objectIDs, targetCount),
    enabled: enabled && objectIDs.length > 0,
    staleTime: TEN_MINUTES,
    retry: 1,
  });
}

export function useArtwork(objectID: number) {
  return useQuery({
    queryKey: ["artwork", objectID],
    queryFn: () => EnhancedMetAPI.getArtwork(objectID),
    enabled: !!objectID,
    staleTime: TEN_MINUTES,
    retry: 2,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => EnhancedMetAPI.getDepartments(),
    staleTime: ONE_HOUR,
    retry: 3,
  });
}
