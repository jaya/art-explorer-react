'use client'

import { motion } from 'motion/react'

import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { useArtworks } from '~/modules/artworks/hooks/useArtworks'
import { containerVariants, itemVariants } from '~/shared/animations/stagger'
import { ArtworkCard } from '~/shared/components/ArtworkCard'
import { LoadButton } from '~/shared/components/LoadButton'
import { logUserAction } from '~/shared/helpers/logger'

interface ArtworksContentProps {
  initialData: FetchArtworksResponse
}

export function ArtworksContent({ initialData }: ArtworksContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useArtworks({ initialData })

  return (
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-16 pb-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Artworks
        </h2>
        {data?.pages?.map((page) => (
          <motion.div
            animate="visible"
            className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3"
            data-testid="artworks-list"
            initial="hidden"
            key={page.nextPage ?? 'initial'}
            variants={containerVariants}>
            {page.data.map((artwork) => (
              <motion.div
                className="flex"
                key={artwork.objectID}
                variants={itemVariants}>
                <ArtworkCard
                  artwork={artwork}
                  onClick={() =>
                    logUserAction('click:artworkCard', {
                      from: 'home page',
                      artworkId: artwork.objectID,
                    })
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
        {hasNextPage && (
          <div className="flex justify-center">
            <LoadButton
              isFetching={isFetchingNextPage}
              onClick={() => {
                logUserAction('click:loadMoreArtworks', {
                  from: 'home page',
                  page: data?.pages[data.pages.length - 1].nextPage,
                })
                fetchNextPage()
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
