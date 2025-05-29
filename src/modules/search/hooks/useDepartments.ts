'use client'

import { useQuery } from '@tanstack/react-query'

import { fetchDepartments } from '~/modules/search/actions/fetchDepartments'

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchDepartments(),
  })
}
