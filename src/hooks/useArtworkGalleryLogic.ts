// src/hooks/useArtworkGalleryLogic.ts
import {
  DEFAULT_SEARCH_TERM,
  ITEMS_PER_PAGE,
  MAX_INITIAL_FETCH_ATTEMPTS,
} from "@/constants/galleryConstants";
import { useInfiniteArtworks } from "@/services/artworks";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import type { InfiniteData } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

interface ArtworkPage {
  artworks: Artwork[];
  nextPageCursor?: number;
}

export function useArtworkGalleryLogic() {
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH_TERM);
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_PAGE);
  const [initialFetchAttempts, setInitialFetchAttempts] = useState(0);
  const [corruptedImageIds, setCorruptedImageIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
    isError,
  } = useInfiniteArtworks(searchTerm, selectedDepartment);

  const { removeFavorite, isFavorite, saveFavoriteArtwork } =
    useFavoritesStore();

  const typedData = data as InfiniteData<ArtworkPage, unknown> | undefined;

  const allArtworksFromApi: Artwork[] =
    typedData?.pages
      .flatMap((page: ArtworkPage) => page.artworks)
      ?.filter((artwork: Artwork) => artwork.primaryImage) || [];

  const allValidArtworksFromApi = allArtworksFromApi
    .filter((artwork: Artwork) => {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      if (
        normalizedSearchTerm &&
        normalizedSearchTerm !== DEFAULT_SEARCH_TERM
      ) {
        const searchableFields = [
          artwork.title,
          artwork.artistDisplayName,
          artwork.department,
          artwork.medium,
          artwork.objectDate,
        ];
        return searchableFields.some(
          (field) => field && field.toLowerCase().includes(normalizedSearchTerm)
        );
      }
      return true;
    })
    .filter((artwork: Artwork) => !corruptedImageIds.has(artwork.objectID));

  const artworksToRender = allValidArtworksFromApi.slice(
    0,
    displayedItemsCount
  );
  const isLoading = isPending;

  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
    setInitialFetchAttempts(0);
    setCorruptedImageIds(new Set());
  }, [searchTerm, selectedDepartment]);

  useEffect(() => {
    if (
      isPending ||
      isFetchingNextPage ||
      !typedData?.pages ||
      allValidArtworksFromApi.length >= ITEMS_PER_PAGE ||
      !hasNextPage ||
      initialFetchAttempts >= MAX_INITIAL_FETCH_ATTEMPTS
    ) {
      return;
    }

    setInitialFetchAttempts((prev) => prev + 1);
    fetchNextPage();
  }, [
    typedData,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    initialFetchAttempts,
    fetchNextPage,
    allValidArtworksFromApi.length,
  ]);

  const handleImageCorrupted = useCallback((artworkId: number) => {
    setCorruptedImageIds((prevIds) => new Set(prevIds).add(artworkId));
  }, []);

  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedArtwork(null);
  }, []);

  const toggleFavorite = useCallback(
    (artwork: Artwork) => {
      if (isFavorite(artwork.objectID)) {
        removeFavorite(artwork.objectID);
      } else {
        saveFavoriteArtwork(artwork);
      }
    },
    [isFavorite, removeFavorite, saveFavoriteArtwork]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(currentSearchInput.trim() || DEFAULT_SEARCH_TERM);
    }, 700);
    return () => {
      clearTimeout(handler);
    };
  }, [currentSearchInput]);

  const handleSearch = useCallback((query: string) => {
    setCurrentSearchInput(query);
  }, []);

  const handleLoadMore = useCallback(async () => {
    const newCount = displayedItemsCount + ITEMS_PER_PAGE;
    setDisplayedItemsCount(newCount);
    if (
      newCount > allValidArtworksFromApi.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    displayedItemsCount,
    allValidArtworksFromApi.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const showLoadMoreButton =
    !isLoading &&
    !isFetchingNextPage &&
    (displayedItemsCount < allValidArtworksFromApi.length || hasNextPage);

  return {
    searchTerm,
    artworksToRender,
    isLoading,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
    handleImageCorrupted,
    setSelectedDepartment,
    selectedDepartment,
    showLoadMoreButton,
    hasNextPage,
    selectedArtwork,
    handleArtworkClick,
    handleCloseDetails,
    isFavorite,
    toggleFavorite,
    error,
    isError,
  };
}
