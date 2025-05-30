import { getArtwork } from '~/modules/details/actions/getArtwork'
import { API } from '~/shared/helpers/api'
import { mockArtwork } from '~/shared/tests/mock'

vi.mock('~/shared/helpers/api', () => ({
  API: {
    get: vi.fn(),
  },
}))

vi.mock('~/modules/details/actions/getArtwork')

const mockAPI = vi.mocked(API.get)
const mockGetArtwork = vi.mocked(getArtwork)

describe('getArtwork', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetArtwork.mockImplementation(async () => mockArtwork)
  })

  it('fetches an artwork', async () => {
    mockAPI.mockResolvedValue({ data: mockArtwork })

    const artwork = await getArtwork({ objectID: 1 })

    expect(artwork).toEqual(mockArtwork)
  })
})
