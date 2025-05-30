import { getArtwork } from '~/modules/details/actions/getArtwork'
import { fetchSearch } from '~/modules/search/actions/fetchSearch'
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

describe('fetchSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetArtwork.mockImplementation(async ({ objectID }) => ({
      ...mockArtwork,
      objectID,
    }))
  })

  it('fetches artworks with query', async () => {
    mockAPI.mockResolvedValue({
      data: {
        objectIDs: ['1'],
        total: 1,
      },
      status: 200,
    })

    const artworks = await fetchSearch({ page: 1, query: 'test' })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual([mockArtwork])
    expect(artworks.nextPage).toEqual(null)
  })

  it('fetches artworks with search type', async () => {
    mockAPI.mockResolvedValue({
      data: {
        objectIDs: ['1'],
        total: 1,
      },
    })

    const artworks = await fetchSearch({ page: 1, searchType: 'artistOrCulture' })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual([mockArtwork])
    expect(artworks.nextPage).toEqual(null)
  })

  it('fetches artworks with department id', async () => {
    mockAPI.mockResolvedValue({
      data: {
        objectIDs: ['1'],
        total: 1,
      },
    })

    const artworks = await fetchSearch({ page: 1, departmentId: '1' })

    expect(artworks).toBeDefined()
    expect(artworks.data).toEqual([mockArtwork])
    expect(artworks.nextPage).toEqual(null)
  })
})
