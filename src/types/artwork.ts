export interface Artwork {
  objectID: number;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  department: string;
  isHighlight: boolean;
  accessionNumber: string;
  primaryImage: string;
  constituents?: Array<{
    constituentID: number;
    role: string;
    name: string;
    constituentULAN_URL: string;
    constituentWikidata_URL: string;
    gender: string;
  }> | null;
  medium: string;
  dimensions: string;
  creditLine: string;
  objectURL: string;
  tags?: Array<{
    term: string;
    AAT_URL: string;
    Wikidata_URL: string;
  }> | null;
}

export interface SearchResponse {
  total: number;
  objectIDs: number[] | null;
}
