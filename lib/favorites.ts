import { FavoriteArtwork } from "./types";

const FAVORITES_KEY = "art-explorer-favorites";

export class FavoritesManager {
  static getFavorites(): FavoriteArtwork[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addFavorite(artwork: FavoriteArtwork): void {
    if (typeof window === "undefined") return;

    const favorites = this.getFavorites();
    const exists = favorites.some((fav) => fav.objectID === artwork.objectID);

    if (!exists) {
      const updated = [
        ...favorites,
        { ...artwork, dateAdded: new Date().toISOString() },
      ];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("favoritesChanged"));
    }
  }

  static removeFavorite(objectID: number): void {
    if (typeof window === "undefined") return;

    const favorites = this.getFavorites();
    const updated = favorites.filter((fav) => fav.objectID !== objectID);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  }

  static isFavorite(objectID: number): boolean {
    return this.getFavorites().some((fav) => fav.objectID === objectID);
  }

  static toggleFavorite(artwork: FavoriteArtwork): boolean {
    const isFav = this.isFavorite(artwork.objectID);

    if (isFav) {
      this.removeFavorite(artwork.objectID);
      return false;
    } else {
      this.addFavorite(artwork);
      return true;
    }
  }
}
