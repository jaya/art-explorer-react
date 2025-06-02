import { env } from '~/shared/helpers/env'

describe('env', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  it('validates and exposes NEXT_PUBLIC_API_URL correctly', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://test-api.com'

    expect(env.NEXT_PUBLIC_API_URL).toBe('https://test-api.com')
  })

  it('throws error when NEXT_PUBLIC_API_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_API_URL

    await expect(async () => {
      await import('~/shared/helpers/env')
    }).rejects.toThrow()
  })
})
