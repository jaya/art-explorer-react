'use client'

import {
  ARTWORKS_KEY_QUERY,
  PAGE_ITEMS_SIZE,
} from '@/constants/gallery.constant'
import type { Artwork } from '@/models/art'
import { ArtworkService } from '@/services/artworks'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ArtworkCard } from '~/components/artwork-card'
import { Button } from '~/components/ui/button'

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
    queryKey: [ARTWORKS_KEY_QUERY, objectIds],
    queryFn: async ({ pageParam = 0 }) => {
      const ids = objectIds.slice(pageParam, pageParam + PAGE_ITEMS_SIZE)
      const artworks = await Promise.all(
        ids.map(async id => {
          const cached = queryClient.getQueryData<Artwork>([
            ARTWORKS_KEY_QUERY,
            id,
          ])
          if (cached) return cached

          try {
            const data = await ArtworkService.getById(id)
            if (data?.primaryImageSmall) {
              queryClient.setQueryData<Artwork>([ARTWORKS_KEY_QUERY, id], data)
            }
            return data
          } catch (err) {
            console.warn(`Failed to fetch artwork ID ${id}:`, err)
            return null
          }
        })
      )
      return {
        artworks: artworks.filter(art => art?.primaryImageSmall),
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
      <div className="flex flex-wrap gap-4 items-stretch">
        <AnimatePresence>
          {data?.pages.flatMap(page =>
            page.artworks.map((art, index) => (
              <motion.div
                key={art?.objectID}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {art && <ArtworkCard artwork={art} />}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div ref={sentinelRef} style={{ height: 20, paddingTop: 20 }}>
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </div>

      {isFetchingNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center w-full">
            <LoaderCircle className="animate-spin size-10" />
          </p>
        </motion.div>
      )}
      {!hasNextPage && data?.pages[0].artworks.length !== 0 && (
        <p>No more artworks.</p>
      )}
      {!hasNextPage && data?.pages[0].artworks.length === 0 && (
        <p>No artworks founds in this search.</p>
      )}
    </div>
  )
}
