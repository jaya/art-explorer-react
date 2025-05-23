import type { SearchMode } from '../components/SearchModeToggle'

interface BuildParams {
  query: string
  mode: SearchMode
  departmentId: number | null
}

export function buildSearchParams({ query, mode, departmentId }: BuildParams) {
  if (!query) return ''
  const params = new URLSearchParams()

  params.set('hasImages', 'true')
  params.set('q', query)

  if (mode === 'artist') params.set('artistOrCulture', 'true')

  if (departmentId !== null) params.set('departmentId', String(departmentId))

  return params.toString()
}
