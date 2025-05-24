'use client'

import {
  ARTWORKS_KEY_QUERY,
  PAGE_ITEMS_SIZE,
} from '@/constants/gallery.constant'
import type { Artwork } from '@/models/art'
import { ArtworkService } from '@/services/artworks'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { ArtworkCard } from 'app/components/artwork-card'
import { useEffect, useRef } from 'react'

type Props = {
  objectIds: number[]
}

export const Gallery = ({ objectIds }: Props) => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [ARTWORKS_KEY_QUERY],
    queryFn: async ({ pageParam = 0 }) => {
      const ids = objectIds.slice(pageParam, pageParam + PAGE_ITEMS_SIZE)
      const artworks = await Promise.all(
        ids.map(async id => {
          const cached = queryClient.getQueryData<Artwork>([
            ARTWORKS_KEY_QUERY,
            id,
          ])
          if (cached) return cached

          const data = await ArtworkService.getById(id)
          if (data.primaryImageSmall) {
            queryClient.setQueryData<Artwork>([ARTWORKS_KEY_QUERY, id], data)
          }
          return data
        })
      )
      return {
        artworks: artworks.filter(art => art.primaryImageSmall),
        nextIndex: pageParam + PAGE_ITEMS_SIZE,
      }
    },
    getNextPageParam: lastPage => {
      return lastPage.nextIndex < objectIds.length
        ? lastPage.nextIndex
        : undefined
    },
    initialPageParam: 0,
  })

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchNextPage()
      }
    })

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage])

  if (status === 'pending') return <p>Loading gallery...</p>
  if (status === 'error') return <p>Error: {(error as Error).message}</p>

  return (
    <div className="p-2 md:p-8">
      <div className="flex flex-wrap gap-4 justify-between items-stretch">
        {data?.pages.flatMap(page =>
          page.artworks.map(art => (
            <ArtworkCard artwork={art} key={art.objectID} />
          ))
        )}
      </div>

      <div ref={sentinelRef} style={{ height: 20 }} />

      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>End gallery.</p>}
    </div>
  )
}
