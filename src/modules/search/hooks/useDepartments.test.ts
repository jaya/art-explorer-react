import { fetchDepartments } from '~/modules/search/actions/fetchDepartments'
import { useDepartments } from '~/modules/search/hooks/useDepartments'
import { mapDepartments } from '~/modules/search/utils/mapper'
import { mockDepartments } from '~/shared/tests/mock'
import { renderHook, waitFor } from '~/shared/tests/utils'

vi.mock('~/modules/search/actions/fetchDepartments', () => ({
  fetchDepartments: vi.fn(),
}))

const mockFetchDepartments = vi.mocked(fetchDepartments)

describe('useDepartments', () => {
  const mockMappedDepartments = mapDepartments(mockDepartments)

  beforeEach(() => {
    vi.clearAllMocks()

    mockFetchDepartments.mockImplementation(async () => mockMappedDepartments)
  })

  it('fetches departments', async () => {
    const { result } = renderHook(() => useDepartments())

    await waitFor(() => {
      expect(result.current.data).toEqual(mockMappedDepartments)
    })
  })
})
