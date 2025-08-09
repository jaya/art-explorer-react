"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtworkCard } from "@/components/Artwork/Card/ArtworkCard";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesGrid() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-gray-400">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start exploring artworks and click the heart icon to add them to
              your favorites collection.
            </p>
          </div>

          <Link href="/">
            <Button className="gap-2">
              Explore Artworks
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
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
        {favorites.map((favorite, index) => (
          <ArtworkCard
            key={favorite.objectID}
            objectID={favorite.objectID}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}
