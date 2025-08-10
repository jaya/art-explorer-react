import { MetMuseumAPI } from "@/lib/api";

global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("MetMuseumAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSearchResponse = {
    total: 10,
    objectIDs: [1, 2, 3, 4, 5],
  };

  const mockResponse = {
    ok: true,
    json: jest.fn().mockResolvedValue(mockSearchResponse),
  } as unknown as Response;

  describe("searchArtworks", () => {
    it("should search artworks with default parameters", async () => {
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await MetMuseumAPI.searchArtworks("painting");

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("q=painting"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockSearchResponse);
    });

    it("should search artworks with hasImages parameter", async () => {
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await MetMuseumAPI.searchArtworks("painting", true);

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("hasImages=true"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockSearchResponse);
    });

    it("should handle retries on network error", async () => {
      mockedFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValue(mockResponse);

      const result = await MetMuseumAPI.searchArtworks("test");

      expect(result).toEqual(mockSearchResponse);
      expect(mockedFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("getArtwork", () => {
    const mockArtwork = {
      objectID: 1,
      title: "Test Artwork",
      artistDisplayName: "Test Artist",
      primaryImageSmall: "test.jpg",
    };

    it("should get artwork by ID", async () => {
      const artworkResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockArtwork),
      } as unknown as Response;

      mockedFetch.mockResolvedValue(artworkResponse);

      const result = await MetMuseumAPI.getArtwork(1);

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("/objects/1"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockArtwork);
    });
  });

  describe("getDepartments", () => {
    const mockDepartments = {
      departments: [
        { departmentId: 1, displayName: "European Paintings" },
        { departmentId: 2, displayName: "American Wing" },
      ],
    };

    it("should get departments", async () => {
      const departmentsResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockDepartments),
      } as unknown as Response;

      mockedFetch.mockResolvedValue(departmentsResponse);

      const result = await MetMuseumAPI.getDepartments();

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("/departments"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockDepartments);
    });
  });

  describe("searchByDepartment", () => {
    it("should search by department", async () => {
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await MetMuseumAPI.searchByDepartment(1, "painting");

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("departmentId=1"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockSearchResponse);
    });
  });

  describe("searchByArtist", () => {
    it("should search by artist", async () => {
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await MetMuseumAPI.searchByArtist("Van Gogh");

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining("artistOrCulture=true"),
        { next: { revalidate: 3600 } },
      );
      expect(result).toEqual(mockSearchResponse);
    });
  });

  describe("error handling", () => {
    it("should handle network errors gracefully", async () => {
      mockedFetch.mockRejectedValue(new Error("Network error"));

      await expect(MetMuseumAPI.searchArtworks("test")).rejects.toThrow(
        "Network error",
      );
    });

    it("should throw error after max retries", async () => {
      mockedFetch.mockRejectedValue(new Error("Network error"));

      await expect(MetMuseumAPI.searchArtworks("test")).rejects.toThrow(
        "Network error",
      );
      expect(mockedFetch).toHaveBeenCalledTimes(3);
    });
  });
});
