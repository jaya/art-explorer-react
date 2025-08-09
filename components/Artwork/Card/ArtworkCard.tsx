"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { useArtwork } from "@/hooks/useArtworks";
import { useFavorites } from "@/hooks/useFavorites";
import { useArtworkStore } from "@/stores/useArtworkStore";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  objectID: number;
  index: number;
}

export function ArtworkCard({ objectID, index }: ArtworkCardProps) {
  const { getCachedArtwork } = useArtworkStore();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const cachedArtwork = getCachedArtwork(objectID);

  const { data: fetchedArtwork, isLoading, error } = useArtwork(objectID);

  const artwork = cachedArtwork || fetchedArtwork;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (artwork) {
      toggleFavorite({
        objectID: artwork.objectID,
        title: artwork.title || "Untitled",
        artistDisplayName: artwork.artistDisplayName || "Unknown Artist",
        primaryImageSmall: artwork.primaryImageSmall,
        dateAdded: new Date().toISOString(),
      });
    }
  };

  if (isLoading && !cachedArtwork) {
    return (
      <Card className="overflow-hidden h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <LoadingSpinner />
          </div>
          <div className="p-4 h-[100px] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-[2.5rem] space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !artwork || !artwork.primaryImageSmall) {
    return null;
  }

  const isArtworkFavorite = isFavorite(artwork.objectID);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <Link href={`/artwork/${artwork.objectID}`} className="block h-full">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="relative aspect-square overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {!imageError && (
                <Image
                  src={artwork.primaryImageSmall || "/placeholder.svg"}
                  alt={artwork.title || "Untitled"}
                  fill
                  className={cn(
                    "object-cover transition-all duration-300 group-hover:scale-105",
                    imageLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              )}

              {imageError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-sm">Image not available</div>
                  </div>
                </div>
              )}

              <Button
                variant="default"
                size="icon"
                className={cn(
                  "absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white shadow-sm cursor-pointer transition-all duration-200 z-10",
                  isArtworkFavorite &&
                    "text-red-500 bg-red-50/90 hover:bg-red-50",
                )}
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 opacity-60",
                    isArtworkFavorite && "fill-current opacity-100",
                  )}
                />
              </Button>

              {artwork.department && (
                <Badge className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 max-w-[calc(100%-100px)] truncate">
                  {artwork.department}
                </Badge>
              )}
            </div>

            <div className="p-4 h-[100px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col justify-center space-y-2">
                <div className="h-[2.5rem] flex items-start">
                  <h3 className="artwork-card-title font-semibold text-sm leading-5 line-clamp-2 group-hover:text-primary transition-colors">
                    {artwork.title || "Untitled"}
                  </h3>
                </div>

                <div className="h-5 flex items-center">
                  <p className="artwork-card-artist text-xs text-secondary-foreground line-clamp-1 w-full">
                    {artwork.artistDisplayName || "Unknown Artist"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
