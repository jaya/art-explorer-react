export class MetMuseumAPI {
  private static async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error("Max retries exceeded");
  }

  static async searchArtworks(
    query: string = "painting",
    hasImages: boolean = true,
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      hasImages: hasImages.toString(),
      q: query,
    });

    return this.fetchWithRetry<SearchResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/search?${params}`,
    );
  }

  static async getArtwork(objectID: number): Promise<MetArtwork> {
    return this.fetchWithRetry<MetArtwork>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/objects/${objectID}`,
    );
  }

  static async getDepartments(): Promise<DepartmentsResponse> {
    return this.fetchWithRetry<DepartmentsResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/departments`,
    );
  }

  static async searchByDepartment(
    departmentId: number,
    query: string = "",
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      departmentId: departmentId.toString(),
      hasImages: "true",
    });

    if (query) {
      params.append("q", query);
    }

    return this.fetchWithRetry<SearchResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/search?${params}`,
    );
  }

  static async searchByArtist(artist: string): Promise<SearchResponse> {
    const params = new URLSearchParams({
      artistOrCulture: "true",
      hasImages: "true",
      q: artist,
    });

    return this.fetchWithRetry<SearchResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/search?${params}`,
    );
  }
}
