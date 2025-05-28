'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { fetchArtworks } from '~/modules/artworks/actions/fetchArtworks'

interface UseArtworksProps {
  initialData: FetchArtworksResponse
}

export function useArtworks({ initialData }: UseArtworksProps) {
  return useInfiniteQuery({
    queryKey: ['artworks'],
    queryFn: ({ pageParam = 1 }) => fetchArtworks({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  })
}
