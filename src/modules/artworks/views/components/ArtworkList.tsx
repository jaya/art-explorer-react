'use client'

import { Fragment } from 'react'

import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { useArtworks } from '~/modules/artworks/hooks/useArtworks'
import { ArtworkCard } from '~/modules/artworks/views/components/ArtworkCard'
import { LoadButton } from '~/modules/artworks/views/components/LoadButton'

interface ArtworksListProps {
  initialData: FetchArtworksResponse
}

export function ArtworksList({ initialData }: ArtworksListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useArtworks({ initialData })

  return (
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Artworks
        </h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
          {data?.pages?.map((page) => (
            <Fragment key={page.nextPage}>
              {page.data.map((artwork) => (
                <ArtworkCard
                  artwork={artwork}
                  key={artwork.objectID}
                />
              ))}
            </Fragment>
          ))}
        </div>
        {hasNextPage && (
          <div className="flex justify-center">
            <LoadButton
              isFetching={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            />
          </div>
        )}
      </div>
    </section>
  )
}
