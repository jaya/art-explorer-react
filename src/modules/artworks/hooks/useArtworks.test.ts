import type { FetchArtworksResponse } from '~/modules/artworks/actions/fetchArtworks'
import { useArtworks } from '~/modules/artworks/hooks/useArtworks'
import { mockArtwork } from '~/shared/tests/mock'
import { renderHook, waitFor } from '~/shared/tests/utils'

vi.mock('~/modules/artworks/actions/fetchArtworks', () => ({
  fetchArtworks: vi.fn(),
}))

const mockInitialData: FetchArtworksResponse = {
  data: [mockArtwork],
  nextPage: 2,
}

describe('useArtworks', () => {
  it('should return the initial data', async () => {
    const { result } = renderHook(() => useArtworks({ initialData: mockInitialData }))

    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([mockInitialData])
    })
  })
})
