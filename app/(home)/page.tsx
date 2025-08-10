"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { ArtworkGrid } from "@/components/Artwork/Grid/ArtworkGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCursorTrail } from "@/components/ImageCursorTrail/ImageCursorTrail";
import { ImagePreloader } from "@/components/ImagePreloader/ImagePreloader";

const images = [
  "./images/24214po.jpg",
  "./images/67253pl.jpg",
  "./images/100151ab.jpg",
  "./images/200632fg.jpg",
  "./images/203014fg.jpg",
  "./images/205471fg.jpg",
  "./images/217312fg.jpg",
  "./images/217390fg.jpg",
  "./images/221337fg.jpg",
  "./images/224219fg.jpg",
  "./images/225220fg.jpg",
  "./images/230446fg.jpg",
  "./images/233950fg.jpg",
  "./images/234608fg.jpg",
  "./images/250732fg.jpg",
  "./images/251582fg.jpg",
  "./images/307289rg.jpg",
  "./images/402974mt.jpg",
  "./images/403607mt.jpg",
  "./images/403794mt.jpg",
  "./images/501985ld.jpg",
  "./images/501989ld.jpg",
  "./images/501990ld.jpg",
  "./images/502001ld.jpg",
  "./images/506798ld.jpg",
  "./images/514241ld.jpg",
  "./images/600453sl.jpg",
  "./images/601845sl.jpg",
  "./images/605620sl.jpg",
  "./images/701647an.jpg",
  "./images/704033an.jpg",
  "./images/704083an.jpg",
  "./images/911523ab.jpg",
  "./images/912062ab.jpg",
  "./images/952838il.jpg",
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 flex justify-center">
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
      <ImagePreloader images={images} priority />
      <div className="text-center space-y-4 flex justify-center">
        <ImageCursorTrail
          items={images}
          maxNumberOfImages={5}
          distance={25}
          imgClass="sm:w-40 w-28 sm:h-48 h-36"
          className="max-w-4xl rounded-3xl"
        >
          <article className="relative z-50 flex flex-col items-center justify-center ">
            <h1 className="text-4xl font-bold tracking-tight">
              Discover Amazing Art
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of masterpieces from the Metropolitan Museum of
              Art collection
            </p>
          </article>
        </ImageCursorTrail>
      </div>

      <SearchBar />
      <ArtworkGrid />
    </div>
  );
}
