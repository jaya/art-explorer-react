import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { fetchSearch } from '~/modules/search/actions/fetchSearch'
import { useSearch } from '~/modules/search/hooks/useSearch'
import { mockArtwork } from '~/shared/tests/mock'
import { renderHook, waitFor } from '~/shared/tests/utils'

vi.mock('~/modules/search/actions/fetchSearch', () => ({
  fetchSearch: vi.fn(),
}))

const mockFetchSearch = vi.mocked(fetchSearch)

const mockArtworksData: FetchArtworksResponse = {
  data: [mockArtwork],
  nextPage: 2,
}

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockFetchSearch.mockImplementation(async () => mockArtworksData)
  })

  it('fetches artworks with query', async () => {
    const { result } = renderHook(() => useSearch({ query: 'test' }))

    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([mockArtworksData])
    })
  })

  it('fetches artworks with search type', async () => {
    const { result } = renderHook(() => useSearch({ query: 'test', searchType: 'artistOrCulture' }))

    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([mockArtworksData])
    })
  })

  it('fetches artworks with department id', async () => {
    const { result } = renderHook(() => useSearch({ query: 'test', departmentId: '1' }))

    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([mockArtworksData])
    })
  })
})
