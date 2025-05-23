export interface SearchResponse {
  total: number
  objectIDs: number[]
}

export interface ObjectDetail {
  objectID: number
  objectName: string
  title: string
  department: string
  primaryImage: string
  primaryImageSmall: string
  culture: string
  artistDisplayName: string
  classification: string
  objectDate: string
  objectURL: string
}

export interface DepartmentsResponse {
  departments: {
    departmentId: number
    displayName: string
  }[]
}
