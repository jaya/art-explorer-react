"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { useArtwork } from "@/hooks/useArtworks";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface ArtworkDetailProps {
  objectID: number;
}

export function ArtworkDetail({ objectID }: ArtworkDetailProps) {
  const { data: artwork, isLoading, error } = useArtwork(objectID);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleToggleFavorite = () => {
    if (artwork) {
      toggleFavorite({
        objectID: artwork.objectID,
        title: artwork.title,
        artistDisplayName: artwork.artistDisplayName,
        primaryImageSmall: artwork.primaryImageSmall,
        dateAdded: new Date().toISOString(),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading artwork details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-red-500 mb-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold">Artwork Not Found</h3>
          <p className="text-sm text-gray-600 mt-2">
            The artwork you&apos;re looking for could not be found.
          </p>
        </div>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
      </div>
    );
  }

  const isArtworkFavorite = isFavorite(artwork.objectID);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={isArtworkFavorite ? "default" : "outline"}
            onClick={handleToggleFavorite}
            className={cn(
              "gap-2 dark:text-accent-foreground",
              isArtworkFavorite && "bg-red-500 hover:bg-red-600",
            )}
          >
            <Heart
              className={cn("w-4 h-4", isArtworkFavorite && "fill-current")}
            />
            {isArtworkFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}

                {!imageError && artwork.primaryImage && (
                  <Image
                    src={artwork.primaryImage || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className={cn(
                      "object-contain transition-opacity duration-300",
                      imageLoading ? "opacity-0" : "opacity-100",
                    )}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    priority
                  />
                )}

                {(imageError || !artwork.primaryImage) && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <div>Image not available</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {artwork.additionalImages && artwork.additionalImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {artwork.additionalImages.slice(0, 3).map((imageUrl, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${artwork.title} - Additional view ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {artwork.title || "Untitled"}
            </h1>

            {artwork.artistDisplayName && (
              <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                <User className="w-5 h-5" />
                <span>{artwork.artistDisplayName}</span>
              </div>
            )}

            {artwork.department && (
              <Badge variant="secondary" className="mb-4">
                {artwork.department}
              </Badge>
            )}
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {artwork.objectDate && (
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{artwork.objectDate}</span>
                </div>
              )}

              {artwork.technique && (
                <div className="flex justify-between">
                  <span className="font-medium">Technique:</span>
                  <span className="text-right">{artwork.technique}</span>
                </div>
              )}

              {artwork.dimensions && (
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span className="text-right">{artwork.dimensions}</span>
                </div>
              )}

              {artwork.classification && (
                <div className="flex justify-between">
                  <span className="font-medium">Classification:</span>
                  <span>{artwork.classification}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(artwork.culture || artwork.period || artwork.dynasty) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Cultural Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artwork.culture && (
                  <div className="flex justify-between">
                    <span className="font-medium">Culture:</span>
                    <span>{artwork.culture}</span>
                  </div>
                )}

                {artwork.period && (
                  <div className="flex justify-between">
                    <span className="font-medium">Period:</span>
                    <span>{artwork.period}</span>
                  </div>
                )}

                {artwork.dynasty && (
                  <div className="flex justify-between">
                    <span className="font-medium">Dynasty:</span>
                    <span>{artwork.dynasty}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Museum Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {artwork.accessionNumber && (
                <div className="flex justify-between">
                  <span className="font-medium">Accession Number:</span>
                  <span>{artwork.accessionNumber}</span>
                </div>
              )}

              {artwork.creditLine && (
                <div>
                  <span className="font-medium">Credit Line:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {artwork.creditLine}
                  </p>
                </div>
              )}

              {artwork.GalleryNumber && (
                <div className="flex justify-between">
                  <span className="font-medium">Gallery:</span>
                  <span>Gallery {artwork.GalleryNumber}</span>
                </div>
              )}

              {artwork.objectURL && (
                <CardContent className="pt-6">
                  <Link
                    href={artwork.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Button className="w-full hover:cursor-pointer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View at The Metropolitan Museum of Art
                    </Button>
                  </Link>
                </CardContent>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
