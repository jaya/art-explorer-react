'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { FavoriteButton } from '~/shared/components/FavoriteButton'
import type { Artwork } from '~/shared/types'
import { cn } from '~/shared/utils/className'

interface ArtworkCardProps {
  artwork: Artwork
  onClick?: () => void
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const imageUrl = artwork.primaryImageSmall
  const hasArtist = artwork.artistDisplayName

  return (
    <article className="relative flex flex-1 overflow-hidden rounded-lg border border-sidebar-border">
      <div className="absolute top-4 right-4 z-1">
        <FavoriteButton artwork={artwork} />
      </div>
      <Link
        className="flex flex-1"
        href={`/details/${artwork.objectID}`}
        onClick={onClick}>
        <div className="flex flex-1 flex-col">
          <motion.div
            className="relative h-56 w-full rounded-t-lg"
            whileHover={{ scale: 1.02 }}>
            {imageUrl ? (
              <Image
                alt={artwork.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={imageUrl}
              />
            ) : (
              <img
                alt="No image available"
                className="object-cover"
                src="https://placehold.co/500x300?text=No+image+available"
              />
            )}
          </motion.div>
          <div className="flex flex-1 flex-col bg-card p-4">
            <h3 className={cn('text-center font-serif text-2xl', hasArtist ? 'line-clamp-1' : 'line-clamp-2')}>
              {artwork.title}
            </h3>
            <p className="text-center text-lg text-muted-foreground">{artwork.artistDisplayName}</p>
          </div>
        </div>
      </Link>
    </article>
  )
}
