'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { Artwork } from '~/modules/artworks/types'
import { FavoriteButton } from '~/shared/components/FavoriteButton'
import { cn } from '~/shared/utils/className'

interface ArtworkCardProps {
  artwork: Artwork
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageUrl = artwork.primaryImageSmall
  const hasArtist = artwork.artistDisplayName

  return (
    <div className="relative rounded-lg border border-border">
      <div className="absolute top-4 right-4 z-1">
        <FavoriteButton artwork={artwork} />
      </div>
      <Link href={`/details/${artwork.objectID}`}>
        <div className="flex flex-col">
          <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
            {imageUrl ? (
              <Image
                alt={artwork.title}
                className="object-cover"
                fill
                src={imageUrl}
              />
            ) : (
              <img
                alt="No image available"
                className="object-cover"
                src="https://placehold.co/500x300?text=No+image+available"
              />
            )}
          </div>
          <div className="flex flex-col p-4">
            <h3 className={cn('text-center font-serif text-2xl', hasArtist ? 'line-clamp-1' : 'line-clamp-2')}>
              {artwork.title}
            </h3>
            <p className="text-center text-lg text-muted-foreground">{artwork.artistDisplayName}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
