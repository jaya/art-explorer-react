import axios from 'axios'

import { env } from '~/shared/helpers/env'
import { logger } from '~/shared/helpers/logger'

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'content-type': 'application/json' },
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.message)
      logger('error', 'API Error', { error: error.message })
    }
    return Promise.reject(error)
  },
)
