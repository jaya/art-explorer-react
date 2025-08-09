import { MetMuseumAPI } from "./api";
import { DepartmentsResponse, MetArtwork } from "./types";

export type MinimalArtwork = Pick<
  MetArtwork,
  | "objectID"
  | "title"
  | "artistDisplayName"
  | "primaryImageSmall"
  | "department"
  | "objectDate"
  | "technique"
  | "culture"
>;

export interface EnhancedSearchResponse {
  objectIDs: number[];
  total: number;
}

export interface BatchArtworkResponse {
  artworks: MinimalArtwork[];
  failed: number[];
}

export class EnhancedMetAPI {
  private static cache = new Map<string, MetArtwork>();
  private static departmentsCache: DepartmentsResponse | null = null;
  private static batchSize = 8;
  private static requestDelay = 200;

  static async searchArtworks(
    query: string = "painting",
    departmentId?: number,
  ): Promise<EnhancedSearchResponse> {
    try {
      let searchResponse;

      if (departmentId) {
        searchResponse = await MetMuseumAPI.searchByDepartment(
          departmentId,
          query,
        );
      } else {
        searchResponse = await MetMuseumAPI.searchArtworks(query, true);
      }

      const objectIDs = searchResponse.objectIDs || [];

      return {
        objectIDs,
        total: objectIDs.length,
      };
    } catch (error) {
      console.error("Enhanced API search failed:", error);
      return {
        objectIDs: [],
        total: 0,
      };
    }
  }

  static async batchLoadArtworks(
    objectIDs: number[],
    targetCount: number = 15,
  ): Promise<BatchArtworkResponse> {
    const artworks: MinimalArtwork[] = [];
    const failed: number[] = [];
    let processedIndex = 0;

    while (artworks.length < targetCount && processedIndex < objectIDs.length) {
      const remainingNeeded = targetCount - artworks.length;
      const batchSize = Math.min(this.batchSize, remainingNeeded * 2);
      const endIndex = Math.min(processedIndex + batchSize, objectIDs.length);
      const batch = objectIDs.slice(processedIndex, endIndex);

      if (batch.length === 0) break;

      console.log(
        `Loading batch: ${processedIndex}-${endIndex}, need ${remainingNeeded} more artworks`,
      );

      const batchPromises = batch.map(async (objectID) => {
        try {
          const artwork = await this.getArtworkWithCache(objectID);
          if (artwork && artwork.primaryImageSmall) {
            return {
              objectID: artwork.objectID,
              title: artwork.title || "Untitled",
              artistDisplayName: artwork.artistDisplayName || "Unknown Artist",
              primaryImageSmall: artwork.primaryImageSmall,
              department: artwork.department || "",
              objectDate: artwork.objectDate || "",
              technique: artwork.technique || "",
              culture: artwork.culture || "",
            };
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch artwork ${objectID}:`, error);
          failed.push(objectID);
          return null;
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (
          result.status === "fulfilled" &&
          result.value &&
          artworks.length < targetCount
        ) {
          artworks.push(result.value);
        } else if (result.status === "rejected") {
          failed.push(batch[index]);
        }
      });

      processedIndex = endIndex;

      if (processedIndex < objectIDs.length && artworks.length < targetCount) {
        await new Promise((resolve) => setTimeout(resolve, this.requestDelay));
      }
    }

    console.log(
      `Batch loading complete: got ${artworks.length} artworks, failed: ${failed.length}`,
    );
    return { artworks, failed };
  }

  static async getArtwork(objectID: number) {
    return this.getArtworkWithCache(objectID);
  }

  private static async getArtworkWithCache(objectID: number) {
    const cacheKey = `artwork_${objectID}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const artwork = await MetMuseumAPI.getArtwork(objectID);
      this.cache.set(cacheKey, artwork);
      return artwork;
    } catch (error) {
      console.warn(`Failed to fetch artwork ${objectID}:`, error);
      return null;
    }
  }

  static async getDepartments() {
    if (this.departmentsCache) {
      return this.departmentsCache;
    }

    try {
      const response = await MetMuseumAPI.getDepartments();
      this.departmentsCache = response;
      return response;
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      return { departments: [] };
    }
  }
}
