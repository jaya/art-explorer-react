type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export function logger(level: LogLevel, message: string, payload?: unknown) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  if (payload) {
    console[level](base, payload)
  } else {
    console[level](base)
  }

  // TODO: Implementar captura de logs e observabilidade com Datadog, etc
}
