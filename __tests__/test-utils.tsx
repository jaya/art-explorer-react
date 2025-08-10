/* eslint-disable @typescript-eslint/no-namespace */
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

export const mockArtwork = {
  objectID: 123,
  title: "Test Artwork",
  artistDisplayName: "Test Artist",
  primaryImageSmall: "https://example.com/image.jpg",
  primaryImage: "https://example.com/large-image.jpg",
  department: "Paintings",
  dateBegin: 1800,
  dateEnd: 1850,
  medium: "Oil on canvas",
  dimensions: "24 x 36 in.",
  city: "New York",
  country: "United States",
  creditLine: "Gift of Test Donor",
  repository: "Metropolitan Museum of Art",
  objectURL: "https://www.metmuseum.org/art/collection/search/123",
  tags: [
    { term: "Landscapes", AAT_URL: "", Wikidata_URL: "" },
    { term: "Nature", AAT_URL: "", Wikidata_URL: "" },
  ],
  isHighlight: true,
  isPublicDomain: true,
  objectWikidata_URL: "https://www.wikidata.org/wiki/Q123",
  GalleryNumber: "201",
};

export const mockFavoriteArtwork = {
  objectID: 123,
  title: "Test Artwork",
  artistDisplayName: "Test Artist",
  primaryImageSmall: "https://example.com/image.jpg",
  dateAdded: "2023-01-01T00:00:00.000Z",
};

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> = {},
) {
  const renderOptions = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export const createMockUseFavorites = (overrides = {}) => ({
  favorites: [],
  isFavorite: jest.fn().mockReturnValue(false),
  toggleFavorite: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  clearFavorites: jest.fn(),
  ...overrides,
});

export const createMockUseArtwork = (overrides = {}) => ({
  data: mockArtwork,
  isLoading: false,
  error: null,
  ...overrides,
});

export const createMockUseArtworkStore = (overrides = {}) => ({
  getCachedArtwork: jest.fn().mockReturnValue(null),
  setCachedArtwork: jest.fn(),
  searchResults: [],
  isSearching: false,
  searchQuery: "",
  setSearchResults: jest.fn(),
  setIsSearching: jest.fn(),
  setSearchQuery: jest.fn(),
  ...overrides,
});

export const createMockApiResponse = (data: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

export const mockFetch = (response: unknown, status = 200) => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(createMockApiResponse(response, status));
};

export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve(undefined);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

export const customMatchers = {
  toBeInFavorites: (
    received: Array<{ objectID: number }>,
    objectID: number,
  ) => {
    const pass = received.some(
      (item: { objectID: number }) => item.objectID === objectID,
    );
    return {
      message: () =>
        `expected artwork with ID ${objectID} ${pass ? "not " : ""}to be in favorites`,
      pass,
    };
  },
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInFavorites(objectID: number): R;
    }
  }
}

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

export const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

export const mockAsyncOperation = (delay = 100, shouldReject = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error("Async operation failed"));
      } else {
        resolve("Async operation completed");
      }
    }, delay);
  });
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
