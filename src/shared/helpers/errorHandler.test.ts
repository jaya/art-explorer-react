import { handleError } from '~/shared/helpers/errorHandler'
import { logger } from '~/shared/helpers/logger'

vi.mock('~/shared/helpers/logger', () => ({
  logger: vi.fn(),
}))

const mockedLogger = vi.mocked(logger)

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles errors correctly', () => {
    const error = new Error('Test error message')
    error.stack = 'Error stack trace'

    const result = handleError(error, 'test context')

    expect(mockedLogger).toHaveBeenCalledWith('error', 'handleError', {
      error: 'Test error message',
      context: 'test context',
      stack: 'Error stack trace',
    })

    expect(result).toBe(error)
  })
})
