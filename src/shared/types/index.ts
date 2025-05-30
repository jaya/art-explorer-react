export interface Artwork {
  objectID: number
  objectURL: string
  title: string
  primaryImage: string
  primaryImageSmall: string
  artistDisplayName: string
  objectDate: string
  medium: string
  department: string
}

export interface Department {
  departmentId: number
  displayName: string
}

export type SearchType = 'all' | 'artistOrCulture' | 'department'
