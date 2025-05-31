import { logger } from '~/shared/helpers/logger'

export function handleError(error: unknown, context?: string) {
  const err = error instanceof Error ? error : new Error(String(error))

  console.error(`[Error] ${context ?? 'Unknown context'}:`, err.message, err.stack)
  logger('error', 'handleError', { error: err.message, context })

  // TODO: Implementar captura de erros com Sentry, LogRocket, etc
  return err
}
