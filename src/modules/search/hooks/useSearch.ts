'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import { fetchSearch } from '~/modules/search/actions/fetchSearch'
import type { SearchType } from '~/shared/types'

interface UseSearchProps {
  query?: string
  searchType?: SearchType
  departmentId?: string
  enabled?: boolean
}

export function useSearch({ query = '', searchType = 'all', departmentId = '', enabled = true }: UseSearchProps) {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam = 1 }) => fetchSearch({ page: pageParam, query, searchType, departmentId }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => {
      data.pages.forEach((page) => {
        page.data.forEach((artwork) => {
          queryClient.setQueryData(['search', artwork.objectID], artwork)
        })
      })
      return data
    },
    initialPageParam: 1,
    enabled,
  })
}
