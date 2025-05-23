import axios from 'axios'

const api = axios.create({
  baseURL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  timeout: 10000,
})

export default api
