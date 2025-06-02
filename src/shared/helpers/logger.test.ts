import { logger } from '~/shared/helpers/logger'

describe('logger', () => {
  let consoleSpy: {
    debug: ReturnType<typeof vi.fn>
    info: ReturnType<typeof vi.fn>
    warn: ReturnType<typeof vi.fn>
    error: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    consoleSpy = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }

    global.console = consoleSpy as any
  })

  it('logs debug messages correctly', () => {
    logger('debug', 'Test debug message')

    expect(consoleSpy.debug).toHaveBeenCalledWith(expect.stringMatching(/\[DEBUG\] Test debug message/))
  })

  it('logs info messages correctly', () => {
    logger('info', 'Test info message')

    expect(consoleSpy.info).toHaveBeenCalledWith(expect.stringMatching(/\[INFO\] Test info message/))
  })

  it('logs warn messages correctly', () => {
    logger('warn', 'Test warn message')

    expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringMatching(/\[WARN\] Test warn message/))
  })

  it('logs error messages correctly', () => {
    logger('error', 'Test error message')

    expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringMatching(/\[ERROR\] Test error message/))
  })
})
