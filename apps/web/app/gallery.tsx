'use client'

import { ARTWORKS_KEY_QUERY, QTD_ITEMS } from '@/constants/gallery.constant'
import type { Artwork } from '@/models/art'
import { fetchArtwork } from '@/services/artworks'
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  objectIds: number[]
}

export const Gallery = ({ objectIds }: Props) => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * 24,
            gcTime: 1000 * 60 * 60 * 24,
          },
        },
      })
  )

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
      const ids = objectIds.slice(pageParam, pageParam + QTD_ITEMS)
      const artworks = await Promise.all(
        ids.map(async id => {
          const cached = queryClient.getQueryData<Artwork>([
            ARTWORKS_KEY_QUERY,
            id,
          ])
          if (cached) return cached

          const data = await fetchArtwork(id)
          if (data.primaryImageSmall) {
            queryClient.setQueryData<Artwork>([ARTWORKS_KEY_QUERY, id], data)
          }
          return data
        })
      )
      return {
        artworks: artworks.filter(art => art.primaryImageSmall),
        nextIndex: pageParam + QTD_ITEMS,
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
      <div className="flex flex-wrap gap-4 justify-between items-end">
        {data?.pages.flatMap(page =>
          page.artworks.map(art => (
            <div key={art.objectID} className="mx-auto max-w-7xl">
              <p className="w-[300px]">{art.title}</p>
              <div className="p-4 w-[300px] h-[300px] relative">
                <Image
                  src={art.primaryImageSmall}
                  alt={art.title}
                  fill
                  sizes="(max-width: 1280px) 100%"
                  loading="lazy"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div ref={sentinelRef} style={{ height: 20 }} />

      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>End gallery.</p>}
    </div>
  )
}
