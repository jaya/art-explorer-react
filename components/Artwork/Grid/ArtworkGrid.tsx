"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArtworkCard } from "@/components/Artwork/Card/ArtworkCard";
import { ArtworkGridSkeleton } from "./ArtworkGridSkeleton";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { useArtworkSearch, useBatchArtworks } from "@/hooks/useArtworks";
import { useArtworkStore } from "@/stores/useArtworkStore";
import { MetArtwork } from "@/lib/types";

export function ArtworkGrid() {
  const {
    displayedArtworkIds,
    hasMore,
    itemsPerPage,
    setSearchResults,
    resetSearch,
    addDisplayedArtworks,
    cacheArtwork,
  } = useArtworkStore();

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useArtworkSearch();

  const initialBatchIds =
    searchData?.objectIDs.slice(0, itemsPerPage * 3) || [];
  const shouldLoadInitialBatch =
    initialBatchIds.length > 0 && displayedArtworkIds.length === 0;

  const {
    data: initialBatchData,
    isLoading: initialBatchLoading,
    error: initialBatchError,
  } = useBatchArtworks(initialBatchIds, shouldLoadInitialBatch, itemsPerPage);

  useEffect(() => {
    if (searchData?.objectIDs) {
      setSearchResults(searchData.objectIDs);
      resetSearch();
    }
  }, [searchData?.objectIDs, setSearchResults, resetSearch]);

  useEffect(() => {
    if (initialBatchData?.artworks && displayedArtworkIds.length === 0) {
      const artworkIds = initialBatchData.artworks.map(
        (artwork) => artwork.objectID,
      );
      addDisplayedArtworks(artworkIds);

      initialBatchData.artworks.forEach((artwork) => {
        cacheArtwork(artwork as MetArtwork);
      });

      console.log(
        `Initial batch loaded: ${initialBatchData.artworks.length} artworks`,
      );
    }
  }, [
    initialBatchData,
    displayedArtworkIds.length,
    addDisplayedArtworks,
    cacheArtwork,
  ]);

  if (
    searchLoading ||
    (initialBatchLoading && displayedArtworkIds.length === 0)
  ) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-muted-foreground">Searching for artworks...</p>
        </div>
        <ArtworkGridSkeleton />
      </div>
    );
  }

  if (searchError || initialBatchError) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold">Search Error</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Unable to load artworks. Please try again.
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (displayedArtworkIds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-semibold">No artworks found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayedArtworkIds.map((objectID, index) => (
          <ArtworkCard key={objectID} objectID={objectID} index={index} />
        ))}
      </motion.div>

      {hasMore && (
        <div className="flex justify-center py-8">
          <LoadMoreButton />
        </div>
      )}

      {!hasMore && displayedArtworkIds.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You&apos;ve seen all available artworks
          </p>
        </div>
      )}
    </div>
  );
}

function LoadMoreButton() {
  const {
    searchResults,
    displayedArtworkIds,
    itemsPerPage,
    loadMore,
    addDisplayedArtworks,
    cacheArtwork,
  } = useArtworkStore();

  const nextBatchStart = displayedArtworkIds.length;
  const nextBatchIds = searchResults.slice(
    nextBatchStart,
    nextBatchStart + itemsPerPage * 3,
  );

  const {
    data: nextBatchData,
    isLoading: nextBatchLoading,
    refetch: loadNextBatch,
  } = useBatchArtworks(nextBatchIds, false, itemsPerPage);

  const handleClick = async () => {
    try {
      const result = await loadNextBatch();

      if (result.data?.artworks) {
        console.log(`Load more: got ${result.data.artworks.length} artworks`);

        const newArtworkIds = result.data.artworks.map(
          (artwork) => artwork.objectID,
        );
        addDisplayedArtworks(newArtworkIds);

        result.data.artworks.forEach((artwork) => {
          cacheArtwork(artwork as MetArtwork);
        });

        loadMore();
      }
    } catch (error) {
      console.error("Failed to load more artworks:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={nextBatchLoading || nextBatchIds.length === 0}
      variant="outline"
      size="lg"
    >
      {nextBatchLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Loading...
        </>
      ) : (
        "Load More Artworks"
      )}
    </Button>
  );
}
