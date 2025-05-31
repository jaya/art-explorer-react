'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { fetchArtworks } from '~/modules/artworks/actions/fetchArtworks'

interface UseArtworksProps {
  initialData: FetchArtworksResponse
}

export function useArtworks({ initialData }: UseArtworksProps) {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: ['artworks'],
    queryFn: ({ pageParam = 1 }) => fetchArtworks({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => {
      data.pages.forEach((page) => {
        page.data.forEach((artwork) => {
          queryClient.setQueryData(['artwork', artwork.objectID], artwork)
        })
      })
      return data
    },
    initialPageParam: 1,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  })
}
