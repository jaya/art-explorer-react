import { MUSEUM_API_URL } from '@/constants/met-museum.constant'
import axios from 'axios'

const API = axios.create({
  baseURL: MUSEUM_API_URL,
  timeout: 12000,
})

export default API
