import ArtworkCard from "@/components/ArtworkCard";
import ArtworkDetails from "@/components/ArtworkDetails";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Icon from "@/components/ui/icon";
import { useFavoritesGalleryLogic } from "@/hooks/useFavoritesGalleryLogic";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const {
    searchTerm,
    selectedArtwork,
    filteredFavorites,
    favoriteArtworks, // Usado para a condição de EmptyState inicial
    handleSearch,
    handleRemoveFavorite,
    handleViewDetails,
    handleCloseDetails,
    handleImageCorrupted,
  } = useFavoritesGalleryLogic();

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="heart" className="h-6 w-6 text-primary fill-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Minhas Obras Favoritas
          </h2>
        </div>

        {favoriteArtworks.length === 0 ? (
          <EmptyState
            icon="bookmarkX"
            title="Você ainda não tem obras favoritas"
            description="Explore a coleção e adicione obras que você gostar aos favoritos clicando no ícone de coração."
            action={
              <Button className="gap-2" asChild>
                <Link to="/">
                  <Icon name="paintBucket" className="h-4 w-4" />
                  <span>Explorar obras</span>
                </Link>
              </Button>
            }
          />
        ) : filteredFavorites.length === 0 ? (
          <EmptyState
            icon="search"
            title={`Nenhum favorito para "${searchTerm}"`}
            description={`Nenhum favorito corresponde à sua busca por "${searchTerm}".`}
          />
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filteredFavorites.map((artwork) => (
                <ArtworkCard
                  key={artwork.objectID}
                  artwork={artwork}
                  onViewDetails={handleViewDetails}
                  isFavorite={true} // Na página de favoritos, todos os cards exibidos são favoritos
                  onToggleFavorite={() =>
                    handleRemoveFavorite(artwork.objectID)
                  } // Ajustado para passar ID
                  onImageCorrupted={handleImageCorrupted}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Modal de detalhes da obra */}
      {selectedArtwork && (
        <>
          {console.log("Renderizando modal para:", selectedArtwork.objectID)}
          <ArtworkDetails
            artwork={selectedArtwork}
            onClose={handleCloseDetails}
          />
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
