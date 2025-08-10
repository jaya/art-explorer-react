import { act, renderHook } from "@testing-library/react";
import { useArtworkStore } from "@/stores/useArtworkStore";

describe("useArtworkStore", () => {
  beforeEach(() => {
    useArtworkStore.setState({
      searchQuery: "",
      searchResults: [],
      loadedArtworks: new Map(),
      displayedArtworkIds: [],
      isSearching: false,
      searchError: null,
      currentPage: 1,
      itemsPerPage: 15,
      hasMore: true,
      selectedDepartment: null,
      departments: [],
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useArtworkStore());

      expect(result.current.searchQuery).toBe("");
      expect(result.current.selectedDepartment).toBeNull();
      expect(result.current.displayedArtworkIds).toEqual([]);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("search functionality", () => {
    it("should set search query", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSearchQuery("van gogh");
      });

      expect(result.current.searchQuery).toBe("van gogh");
    });

    it("should set selected department", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSelectedDepartment(5);
      });

      expect(result.current.selectedDepartment).toBe(5);
    });

    it("should reset search state", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSearchQuery("test query");
        result.current.setSelectedDepartment(3);
        result.current.addDisplayedArtworks([1, 2, 3]);
        result.current.setCurrentPage(2);
      });

      act(() => {
        result.current.resetSearch();
      });

      expect(result.current.displayedArtworkIds).toEqual([]);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.searchError).toBeNull();
    });
  });

  describe("artwork management", () => {
    it("should add displayed artworks", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSearchResults([1, 2, 3, 4, 5]);
        result.current.addDisplayedArtworks([1, 2, 3]);
      });

      expect(result.current.displayedArtworkIds).toEqual([1, 2, 3]);
      expect(result.current.hasMore).toBe(true);
    });

    it("should cache artwork", () => {
      const { result } = renderHook(() => useArtworkStore());

      const mockArtwork = {
        objectID: 123,
        title: "Test Artwork",
        artistDisplayName: "Test Artist",
        primaryImageSmall: "test.jpg",
        isPublicDomain: true,
        primaryImage: "test-large.jpg",
        additionalImages: [],
        constituents: [],
        measurements: [],
        tags: [],
        accessionNumber: "123",
        accessionYear: "2021",
        isHighlight: false,
        department: "Test Department",
        objectName: "Test Object",
        culture: "",
        period: "",
        dynasty: "",
        reign: "",
        portfolio: "",
        artistRole: "",
        artistPrefix: "",
        artistDisplayBio: "",
        artistSuffix: "",
        artistAlphaSort: "",
        artistNationality: "",
        artistBeginDate: "",
        artistEndDate: "",
        artistGender: "",
        artistWikidata_URL: "",
        artistULAN_URL: "",
        objectDate: "",
        objectBeginDate: 0,
        objectEndDate: 0,
        technique: "",
        dimensions: "",
        creditLine: "",
        geographyType: "",
        city: "",
        state: "",
        county: "",
        country: "",
        region: "",
        subregion: "",
        locale: "",
        locus: "",
        excavation: "",
        river: "",
        classification: "",
        rightsAndReproduction: "",
        linkResource: "",
        metadataDate: "",
        repository: "",
        objectURL: "",
        objectWikidata_URL: "",
        isTimelineWork: false,
        GalleryNumber: "",
      };

      act(() => {
        result.current.cacheArtwork(mockArtwork);
      });

      const cached = result.current.getCachedArtwork(123);
      expect(cached).toEqual(mockArtwork);
    });

    it("should return undefined for non-cached artwork", () => {
      const { result } = renderHook(() => useArtworkStore());

      const cached = result.current.getCachedArtwork(999);
      expect(cached).toBeUndefined();
    });
  });

  describe("loading states", () => {
    it("should set loading state", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setIsSearching(true);
      });

      expect(result.current.isSearching).toBe(true);

      act(() => {
        result.current.setIsSearching(false);
      });

      expect(result.current.isSearching).toBe(false);
    });

    it("should set search error", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSearchError("Something went wrong");
      });

      expect(result.current.searchError).toBe("Something went wrong");

      act(() => {
        result.current.setSearchError(null);
      });

      expect(result.current.searchError).toBeNull();
    });
  });

  describe("pagination", () => {
    it("should set current page", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setCurrentPage(3);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it("should load more and increment page", () => {
      const { result } = renderHook(() => useArtworkStore());

      act(() => {
        result.current.setSearchResults([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        result.current.addDisplayedArtworks([1, 2, 3]);
        result.current.loadMore();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.hasMore).toBe(true);
    });
  });

  describe("departments", () => {
    it("should set departments", () => {
      const { result } = renderHook(() => useArtworkStore());

      const departments = [
        { departmentId: 1, displayName: "European Paintings" },
        { departmentId: 2, displayName: "American Wing" },
      ];

      act(() => {
        result.current.setDepartments(departments);
      });

      expect(result.current.departments).toEqual(departments);
    });
  });
});
