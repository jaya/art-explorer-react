import { getArtwork } from '~/modules/details/actions/getArtwork'
import { useArtwork } from '~/modules/details/hooks/useArtwork'
import { mockArtwork } from '~/shared/tests/mock'
import { renderHook, waitFor } from '~/shared/tests/utils'

vi.mock('~/modules/details/actions/getArtwork', () => ({
  getArtwork: vi.fn(),
}))

const mockGetArtwork = vi.mocked(getArtwork)

describe('useArtwork', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetArtwork.mockImplementation(async () => mockArtwork)
  })

  it('fetches an artwork', async () => {
    const { result } = renderHook(() => useArtwork({ objectID: 1 }))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockArtwork)
    })
  })
})
