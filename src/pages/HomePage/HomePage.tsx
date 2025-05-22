import ArtworkCard from "@/components/ArtworkCard";
import ArtworkDetails from "@/components/ArtworkDetails";
import DepartmentFilter from "@/components/DepartmentFilter";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import { useArtworkGalleryLogic } from "@/hooks/useArtworkGalleryLogic";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const HomePage: React.FC = () => {
  const {
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
  } = useArtworkGalleryLogic();

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">

        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
        />

        {isLoading && artworksToRender.length === 0 && (
          <Loading
            icon="palette"
            text="Carregando obras..."
            size="lg"
            className="py-20"
          />
        )}

        {!isLoading &&
          !isFetchingNextPage &&
          artworksToRender.length === 0 &&
          !hasNextPage && (
            <EmptyState
              icon="imageOff"
              title={`Nenhuma obra encontrada para "${searchTerm}".`}
              description="Tente uma nova busca com outros termos."
            />
          )}

        {artworksToRender.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence initial={false}>
              {artworksToRender.map((artwork) => (
                <ArtworkCard
                  key={artwork.objectID}
                  artwork={artwork}
                  onViewDetails={handleArtworkClick}
                  isFavorite={isFavorite(artwork.objectID)}
                  onToggleFavorite={() => toggleFavorite(artwork)}
                  onImageCorrupted={handleImageCorrupted}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {showLoadMoreButton && (
          <div className="mt-8 text-center">
            <Button onClick={handleLoadMore} className="px-6 py-2 gap-2">
              <span>Carregar mais obras</span>
              <Icon name="arrowDown" className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isFetchingNextPage && (
          <Loading text="Carregando mais obras..." className="mt-8" />
        )}
      </main>

      {selectedArtwork && (
        <ArtworkDetails
          artwork={selectedArtwork}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default HomePage;
