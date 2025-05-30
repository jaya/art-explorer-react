export interface Artwork {
  objectID: number
  objectURL: string
  title: string
  isHighlight: boolean
  primaryImage: string
  primaryImageSmall: string
  additionalImages: string[]
  artistPrefix: string
  artistDisplayName: string
  artistDisplayBio: string
  objectDate: string
  medium: string
  department: string
  classification: string
}

export interface Department {
  departmentId: number
  displayName: string
}

export type SearchType = 'all' | 'artistOrCulture' | 'department'
