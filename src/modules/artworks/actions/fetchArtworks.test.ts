import { fetchArtworks } from '~/modules/artworks/actions/fetchArtworks'
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

describe('fetchArtworks', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetArtwork.mockImplementation(async ({ objectID }) => ({
      ...mockArtwork,
      objectID,
    }))
  })

  it('fetches artworks', async () => {
    mockAPI.mockResolvedValue({
      data: {
        objectIDs: ['1'],
        total: 1,
      },
      status: 200,
    })

    const artworks = await fetchArtworks({ page: 1 })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual([mockArtwork])
    expect(artworks.nextPage).toEqual(null)
  })

  it('returns empty array when no artworks are found', async () => {
    mockAPI.mockResolvedValue({
      data: {
        objectIDs: [],
        total: 0,
      },
    })

    const artworks = await fetchArtworks({ page: 1 })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual([])
    expect(artworks.nextPage).toEqual(null)
  })

  it('returns next page when there are more artworks', async () => {
    const objectIDsArray = Array.from({ length: 30 }, (_, i) => i + 1)
    const artworksArray = Array.from({ length: 15 }, (_, i) => ({ ...mockArtwork, objectID: i + 1 }))

    mockAPI.mockResolvedValue({
      data: {
        objectIDs: objectIDsArray,
        total: 30,
      },
    })

    const artworks = await fetchArtworks({ page: 1 })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual(artworksArray)
    expect(artworks.nextPage).toEqual(2)
  })

  it('loads more artworks when button is clicked', async () => {
    const objectIDsArray = Array.from({ length: 30 }, (_, i) => i + 1)
    const artworksArray = Array.from({ length: 15 }, (_, i) => ({ ...mockArtwork, objectID: i + 16 }))

    mockAPI.mockResolvedValue({
      data: {
        objectIDs: objectIDsArray,
        total: 30,
      },
    })

    const artworks = await fetchArtworks({ page: 2 })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual(artworksArray)
    expect(artworks.nextPage).toEqual(null)
  })
})
