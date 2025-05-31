import { fetchDepartments } from '~/modules/search/actions/fetchDepartments'
import { mapDepartments } from '~/modules/search/utils/mapper'
import { API } from '~/shared/helpers/api'
import { mockDepartments } from '~/shared/tests/mock'

vi.mock('~/shared/helpers/api', () => ({
  API: {
    get: vi.fn(),
  },
}))

vi.mock('~/modules/search/actions/fetchDepartments')

const mockAPI = vi.mocked(API.get)
const mockFetchDepartments = vi.mocked(fetchDepartments)

describe('fetchDepartments', () => {
  const mockMappedDepartments = mapDepartments(mockDepartments)

  beforeEach(() => {
    vi.clearAllMocks()

    mockFetchDepartments.mockImplementation(async () => mockMappedDepartments)
  })

  it('fetches departments', async () => {
    mockAPI.mockResolvedValue({ data: mockDepartments })

    const departments = await fetchDepartments()

    expect(departments).toEqual(mockMappedDepartments)
  })
})
