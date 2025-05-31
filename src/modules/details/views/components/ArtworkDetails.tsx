'use client'

import Image from 'next/image'
import { DetailsCard } from '~/modules/details/views/components/DetailsCard'
import { FavoriteButton } from '~/shared/components/FavoriteButton'
import type { Artwork } from '~/shared/types'
import { cn } from '~/shared/utils/className'

interface ArtworkDetailProps {
  artwork: Artwork
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const details = {
    artist: artwork.artistDisplayName || 'Unknown artist',
    department: artwork.department,
    date: artwork.objectDate,
    technique: artwork.medium,
    link: artwork.objectURL,
  }

  const imageUrl = artwork.primaryImage

  return (
    <>
      <section className="relative bg-secondary">
        <div className="absolute top-4 right-4 z-1">
          <FavoriteButton artwork={artwork} />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 pt-16 pb-24">
          <h1 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
            {artwork.title}
          </h1>
          <div className="relative h-auto w-full max-w-3xl overflow-hidden rounded-lg shadow-2xl">
            {imageUrl ? (
              <Image
                alt={artwork.title}
                height={1000}
                src={imageUrl}
                width={1000}
              />
            ) : (
              <img
                alt="No image available"
                className="object-cover"
                src="https://placehold.co/1000x700?text=No+image+available"
              />
            )}
          </div>
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 px-4 pt-16 pb-24 md:grid-cols-2">
          {Object.entries(details).map(([label, value]) => (
            <DetailsCard
              className={cn(label === 'link' && 'md:col-span-2')}
              key={label}
              label={label}
              value={value}
            />
          ))}
        </div>
      </section>
    </>
  )
}
