vi.mock('~/shared/helpers/logger', () => ({
  logger: vi.fn(),
}))

vi.mock('~/shared/helpers/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.test.com',
  },
}))

const mockAxiosGet = vi.fn()
const mockAxiosPost = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockAxiosGet,
      post: mockAxiosPost,
      defaults: {
        baseURL: 'https://api.test.com',
        headers: { 'content-type': 'application/json' },
      },
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
    isAxiosError: vi.fn(),
  },
}))

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('creates axios instance with correct configuration', async () => {
    const { API } = await import('~/shared/helpers/api')

    expect(API.defaults.baseURL).toBe('https://api.test.com')
    expect(API.defaults.headers['content-type']).toBe('application/json')
  })

  it('makes successful GET requests', async () => {
    const responseData = { data: 'test data' }
    mockAxiosGet.mockResolvedValue({ status: 200, data: responseData })

    const { API } = await import('~/shared/helpers/api')
    const response = await API.get('/test')

    expect(response.status).toBe(200)
    expect(response.data).toEqual(responseData)
  })

  it('makes successful POST requests', async () => {
    const requestData = { name: 'test' }
    const responseData = { id: 1, name: 'test' }

    mockAxiosPost.mockResolvedValue({ status: 201, data: responseData })

    const { API } = await import('~/shared/helpers/api')
    const response = await API.post('/test', requestData)

    expect(response.status).toBe(201)
    expect(response.data).toEqual(responseData)
  })
})
