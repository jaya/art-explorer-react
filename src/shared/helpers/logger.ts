type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export function logger(level: LogLevel, message: string, payload?: unknown) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  if (payload) {
    console[level](base, payload)
  } else {
    console[level](base)
  }

  // TODO: Implementar captura de logs e observabilidade com Amplitude, Datadog ou Sentry
}

export function logDomainAction(domain: string, action: string, data?: Record<string, unknown>) {
  logger('info', `${domain}:${action}`, {
    domain,
    action,
    timestamp: new Date().toISOString(),
    ...data,
  })
}

export function logUserAction(action: string, data?: Record<string, unknown>) {
  logger('info', `user:${action}`, {
    action,
    userAction: true,
    timestamp: new Date().toISOString(),
    ...data,
  })
}

export function logPerformance(operation: string, duration: number, data?: Record<string, unknown>) {
  logger('info', `performance:${operation}`, {
    operation,
    duration,
    performance: true,
    timestamp: new Date().toISOString(),
    ...data,
  })
}

export function logApiCall(endpoint: string, method: string, status?: number) {
  logger('info', `api:${method}:${endpoint}`, {
    endpoint,
    method,
    status,
    apiCall: true,
    timestamp: new Date().toISOString(),
  })
}
