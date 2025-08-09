import { ArtworkCardSkeleton } from "@/components/Artwork/Card/ArtworkCardSkeleton";

interface ArtworkGridSkeletonProps {
  count?: number;
}

export function ArtworkGridSkeleton({ count = 15 }: ArtworkGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ArtworkCardSkeleton key={index} />
      ))}
    </div>
  );
}
