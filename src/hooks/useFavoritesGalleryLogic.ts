// src/hooks/useFavoritesGalleryLogic.ts
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { useCallback, useMemo, useState } from "react";

export function useFavoritesGalleryLogic() {
  const { favoriteArtworks, removeFavorite } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [corruptedImageIds, setCorruptedImageIds] = useState<Set<number>>(
    new Set()
  );

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    setCorruptedImageIds(new Set()); // Resetar ao mudar a busca
  }, []);

  const handleRemoveFavorite = useCallback(
    (artworkId: number) => {
      removeFavorite(artworkId);
    },
    [removeFavorite]
  );

  const handleViewDetails = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedArtwork(null);
  }, []);

  const handleImageCorrupted = useCallback((artworkId: number) => {
    setCorruptedImageIds((prevIds) => new Set(prevIds).add(artworkId));
  }, []);

  const favoritesSearched = useMemo(() => {
    return searchTerm
      ? favoriteArtworks.filter(
          (artwork) =>
            artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.artistDisplayName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            artwork.department?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : favoriteArtworks;
  }, [favoriteArtworks, searchTerm]);

  const filteredFavorites = useMemo(() => {
    return favoritesSearched
      .filter((artwork) => artwork.primaryImage)
      .filter((artwork) => !corruptedImageIds.has(artwork.objectID));
  }, [favoritesSearched, corruptedImageIds]);

  return {
    searchTerm,
    selectedArtwork,
    corruptedImageIds,
    filteredFavorites,
    favoriteArtworks, // para verificar se há algum favorito antes de filtrar
    handleSearch,
    handleRemoveFavorite,
    handleViewDetails,
    handleCloseDetails,
    handleImageCorrupted,
  };
}
