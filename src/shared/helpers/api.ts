import axios from 'axios'

import { env } from '~/shared/helpers/env'
import { logApiCall } from '~/shared/helpers/logger'

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'content-type': 'application/json' },
})

API.interceptors.response.use(
  (response) => {
    const url = `${response.config?.baseURL}${response.config?.url}` || 'unknown'
    const method = response.config?.method?.toUpperCase() || 'GET'
    const status = response.status

    logApiCall(url, method, status)

    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const url = `${error.config?.baseURL}${error.config?.url}` || 'unknown'
      const method = error.config?.method?.toUpperCase() || 'GET'
      const status = error.response?.status

      logApiCall(url, method, status)
    }
    return Promise.reject(error)
  },
)
