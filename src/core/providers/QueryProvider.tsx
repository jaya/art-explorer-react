'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useRef } from 'react'

import { useFavoriteStore } from '~/modules/favorites/store/favorite'

export function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 3,
          retryDelay: 1000,
          staleTime: 5 * 60 * 1000,
        },
      },
    }),
  ).current

  useEffect(() => {
    useFavoriteStore.persist.rehydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
