'use client'

import { ARTWORKS_KEY_QUERY } from '@/constants/gallery.constant'
import { ArtworkService } from '@/services/artworks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ArtworkCard } from '~/components/artwork-card'
import { Header } from '~/components/header'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/home'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Art GalleryFavorites' },
    { name: 'description', content: 'GalleryFavorites from The Met Museum' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const department = url.searchParams.get('departmentId')

  return {
    search,
    department,
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [ARTWORKS_KEY_QUERY, loaderData.search, loaderData.department],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await ArtworkService.getArtworks(
        loaderData.search ?? undefined,
        loaderData.department ? Number(loaderData.department) : undefined,
        pageParam + 1
      )

      const artworks = response.artworks.filter(art => art?.primaryImage)
      return {
        artworks,
        nextPage: response.hasMore ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: lastPage => lastPage.nextPage,
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
    <>
      <Header title="Art GalleryFavorites - The Met Museum" />
      <div className="p-2 md:p-8">
        <div className="flex flex-wrap gap-4 items-stretch">
          <AnimatePresence>
            {data?.pages.flatMap(page =>
              page.artworks.map((art, index) => (
                <motion.div
                  key={`${page}-${art.objectID}`}
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
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
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
    </>
  )
}
