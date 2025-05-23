import type { ObjectDetail } from '../services/metApi/types'

export function makeArtwork(overrides: Partial<ObjectDetail> = {}): ObjectDetail {
  return {
    objectID: 1,
    title: 'Shoes',
    objectName: 'Painting',
    department: 'European Paintings',
    primaryImage: 'https://images.metmuseum.org/CRDImages/ep/original/DT1947.jpg',
    primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1947.jpg',
    artistDisplayName: 'Vincent van Gogh',
    culture: '',
    objectDate: '1888',
    classification: 'Paintings',
    objectURL: 'https://www.metmuseum.org/art/collection/search/436533',
    ...overrides,
  }
}
