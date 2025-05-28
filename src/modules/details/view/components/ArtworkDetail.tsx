'use client'

import type { Artwork } from '~/modules/artworks/types'

interface ArtworkDetailProps {
  artwork: Artwork
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-24">
      <h1 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
        {artwork.title}
      </h1>
    </div>
  )
}
