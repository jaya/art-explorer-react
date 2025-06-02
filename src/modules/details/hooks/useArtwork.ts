'use client'

import { useQuery } from '@tanstack/react-query'

import { getArtwork } from '~/modules/details/actions/getArtwork'

interface UseArtworkProps {
  objectID: number
}

export function useArtwork({ objectID }: UseArtworkProps) {
  return useQuery({
    queryKey: ['artwork', objectID],
    queryFn: () => getArtwork({ objectID }),
    enabled: !!objectID,
  })
}
