import { FavoritesManager } from "@/lib/favorites";

describe("FavoritesManager", () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  const dispatchEventMock = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, "dispatchEvent", {
      value: dispatchEventMock,
      writable: true,
    });

    jest.clearAllMocks();
  });

  const mockArtwork = {
    objectID: 123,
    title: "Test Artwork",
    artistDisplayName: "Test Artist",
    primaryImageSmall: "test.jpg",
    dateAdded: "2024-01-01T00:00:00Z",
  };

  describe("getFavorites", () => {
    it("should return empty array when no favorites exist", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const favorites = FavoritesManager.getFavorites();

      expect(favorites).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        "art-explorer-favorites",
      );
    });

    it("should return parsed favorites from localStorage", () => {
      const mockFavorites = [
        {
          objectID: 123,
          title: "Test Artwork",
          artistDisplayName: "Test Artist",
          primaryImageSmall: "test.jpg",
          dateAdded: "2024-01-01T00:00:00Z",
        },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFavorites));

      const favorites = FavoritesManager.getFavorites();

      expect(favorites).toEqual(mockFavorites);
    });

    it("should handle malformed JSON gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const favorites = FavoritesManager.getFavorites();

      expect(favorites).toEqual([]);
    });
  });

  describe("addFavorite", () => {
    it("should add new favorite to empty list", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      FavoritesManager.addFavorite(mockArtwork);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "art-explorer-favorites",
        expect.stringContaining('"objectID":123'),
      );
      expect(dispatchEventMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "favoritesChanged" }),
      );
    });

    it("should not add duplicate favorites", () => {
      const existingFavorites = [
        {
          objectID: 123,
          title: "Test Artwork",
          artistDisplayName: "Test Artist",
          primaryImageSmall: "test.jpg",
          dateAdded: "2024-01-01T00:00:00Z",
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavorites),
      );

      FavoritesManager.addFavorite(mockArtwork);

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(dispatchEventMock).not.toHaveBeenCalled();
    });
  });

  describe("removeFavorite", () => {
    it("should remove existing favorite", () => {
      const existingFavorites = [
        {
          objectID: 123,
          title: "Test Artwork",
          artistDisplayName: "Test Artist",
          primaryImageSmall: "test.jpg",
          dateAdded: "2024-01-01T00:00:00Z",
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavorites),
      );

      FavoritesManager.removeFavorite(123);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "art-explorer-favorites",
        "[]",
      );
      expect(dispatchEventMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "favoritesChanged" }),
      );
    });
  });

  describe("isFavorite", () => {
    it("should return true for existing favorite", () => {
      const existingFavorites = [
        {
          objectID: 123,
          title: "Test Artwork",
          artistDisplayName: "Test Artist",
          primaryImageSmall: "test.jpg",
          dateAdded: "2024-01-01T00:00:00Z",
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavorites),
      );

      const result = FavoritesManager.isFavorite(123);

      expect(result).toBe(true);
    });

    it("should return false for non-existing favorite", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const result = FavoritesManager.isFavorite(999);

      expect(result).toBe(false);
    });
  });

  describe("toggleFavorite", () => {
    it("should add favorite when not exists", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const result = FavoritesManager.toggleFavorite(mockArtwork);

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("should remove favorite when exists", () => {
      const existingFavorites = [
        {
          objectID: 123,
          title: "Test Artwork",
          artistDisplayName: "Test Artist",
          primaryImageSmall: "test.jpg",
          dateAdded: "2024-01-01T00:00:00Z",
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavorites),
      );

      const result = FavoritesManager.toggleFavorite(mockArtwork);

      expect(result).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
