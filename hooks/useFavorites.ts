import { useState, useEffect } from "react";
import { FavoritesManager } from "@/lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([]);

  useEffect(() => {
    setFavorites(FavoritesManager.getFavorites());

    const handleFavoritesChange = () => {
      setFavorites(FavoritesManager.getFavorites());
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);
    return () =>
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
  }, []);

  const addFavorite = (artwork: FavoriteArtwork) => {
    FavoritesManager.addFavorite(artwork);
  };

  const removeFavorite = (objectID: number) => {
    FavoritesManager.removeFavorite(objectID);
  };

  const toggleFavorite = (artwork: FavoriteArtwork) => {
    return FavoritesManager.toggleFavorite(artwork);
  };

  const isFavorite = (objectID: number) => {
    return FavoritesManager.isFavorite(objectID);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
