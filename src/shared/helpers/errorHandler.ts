import { logger } from '~/shared/helpers/logger'

export function handleError(error: unknown, context?: string) {
  const err = error instanceof Error ? error : new Error(String(error))

  logger('error', 'handleError', {
    error: err.message,
    context,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  })

  // TODO: Implementar captura de erros com Sentry, LogRocket, etc
  return err
}
