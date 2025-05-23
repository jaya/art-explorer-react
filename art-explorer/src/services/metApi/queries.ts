import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { searchArtworks, getObjectDetail, getDepartments } from './requests'

const PAGE_SIZE = 15

export function useSearchArtworks(query?: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchArtworks(query ?? ''),
    enabled: !!query,
    staleTime: 1000 * 60 * 60,
  })
}

export function useGetObjectDetail(id: number) {
  return useQuery({
    queryKey: ['object', id],
    queryFn: () => getObjectDetail(id),
    enabled: !!id,
    staleTime: Infinity,
  })
}

export function useGetDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  })
}

export function usePaginatedArtworks(query: string) {
  return useInfiniteQuery({
    queryKey: ['paginated-search', query],
    queryFn: async ({ pageParam = 0 }) => {
      const { objectIDs } = await searchArtworks(query)
      const start = pageParam * PAGE_SIZE
      const end = start + PAGE_SIZE
      return objectIDs.slice(start, end)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < PAGE_SIZE ? undefined : allPages.length
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 60,
  })
}
