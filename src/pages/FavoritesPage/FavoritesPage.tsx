import ArtworkCard from "@/components/ArtworkCard";
import ArtworkDetails from "@/components/ArtworkDetails";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Icon from "@/components/ui/icon";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const { favoriteArtworks, removeFavorite } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [corruptedImageIds, setCorruptedImageIds] = useState<Set<number>>(
    new Set()
  );

  // Filtrar favoritos com base na busca
  const favoritesSearched = searchTerm
    ? favoriteArtworks.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.artistDisplayName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          artwork.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favoriteArtworks;

  // Filtrar favoritos para incluir apenas aqueles com primaryImage e não corrompidos
  const filteredFavorites = favoritesSearched
    .filter((artwork) => artwork.primaryImage)
    .filter((artwork) => !corruptedImageIds.has(artwork.objectID));

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCorruptedImageIds(new Set()); // Resetar ao mudar a busca
  };

  const handleRemoveFavorite = (artwork: Artwork) => {
    removeFavorite(artwork.objectID);
  };

  const handleViewDetails = (artwork: Artwork) => {
    console.log("Abrindo detalhes para:", artwork);
    setSelectedArtwork(artwork);
  };

  const handleCloseDetails = () => {
    console.log("Fechando detalhes");
    setSelectedArtwork(null);
  };

  const handleImageCorrupted = (artworkId: number) => {
    setCorruptedImageIds((prevIds) => new Set(prevIds).add(artworkId));
  };

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
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFavorite(artwork)}
                  onImageCorrupted={handleImageCorrupted} // Adicionar prop
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Icon name="palette" className="h-5 w-5 text-primary" />
            <span className="font-semibold">Art Explorer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} - Visualize obras de arte do
            Metropolitan Museum
          </p>
        </div>
      </footer>

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
