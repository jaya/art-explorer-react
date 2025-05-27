'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchArtworks } from '~/modules/artworks/actions/fetchArtworks'

export function useArtworks() {
  return useInfiniteQuery({
    queryKey: ['artworks'],
    queryFn: ({ pageParam = 1 }) => fetchArtworks({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}
