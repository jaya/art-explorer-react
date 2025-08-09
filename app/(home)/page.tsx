"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { ArtworkGrid } from "@/components/Artwork/Grid/ArtworkGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
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
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Discover Amazing Art
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore thousands of masterpieces from the Metropolitan Museum of Art
          collection
        </p>
      </div>

      <SearchBar />
      <ArtworkGrid />
    </div>
  );
}
