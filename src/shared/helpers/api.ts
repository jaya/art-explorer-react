import axios from 'axios'

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'content-type': 'application/json' },
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  },
)
