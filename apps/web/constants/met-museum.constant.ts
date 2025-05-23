export const MUSEUM_API_URL = 'https://collectionapi.metmuseum.org/'
export const ARTS_WITH_IMAGES = `${MUSEUM_API_URL}/public/collection/v1/search?hasImages=true&q=painting`
export const ARTWORKS = `${MUSEUM_API_URL}/public/collection/v1/objects` // /{objectID} to get specific artwork
export const ARTS_BY_ARTIST = `${MUSEUM_API_URL}/public/collection/v1/search?artistOrCulture=true&q=` // van+gogh use this pattern to search by artists
export const DEPARTMENTS = `${MUSEUM_API_URL}/public/collection/v1/departments`
export const ARTS_BY_DEPARTMENT = `${MUSEUM_API_URL}/public/collection/v1/search?departmentId=` // 11&q=portrait use this pattern to search by department
