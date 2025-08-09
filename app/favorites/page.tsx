"use client";

import { useEffect, useState } from "react";
import { FavoritesGrid } from "@/components/Favorites/Grid/FavoritesGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Your Favorite Artworks
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and revisit the artworks you&apos;ve saved to your personal
          collection
        </p>
      </div>

      <FavoritesGrid />
    </div>
  );
}
