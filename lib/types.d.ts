interface MetArtwork {
  objectID: number;
  isHighlight: boolean;
  accessionNumber: string;
  accessionYear: string;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  constituents: Constituent[];
  department: string;
  objectName: string;
  title: string;
  culture: string;
  period: string;
  dynasty: string;
  reign: string;
  portfolio: string;
  artistRole: string;
  artistPrefix: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistSuffix: string;
  artistAlphaSort: string;
  artistNationality: string;
  artistBeginDate: string;
  artistEndDate: string;
  artistGender: string;
  artistWikidata_URL: string;
  artistULAN_URL: string;
  objectDate: string;
  objectBeginDate: number;
  objectEndDate: number;
  technique: string;
  dimensions: string;
  measurements: Measurement[];
  creditLine: string;
  geographyType: string;
  city: string;
  state: string;
  county: string;
  country: string;
  region: string;
  subregion: string;
  locale: string;
  locus: string;
  excavation: string;
  river: string;
  classification: string;
  rightsAndReproduction: string;
  linkResource: string;
  metadataDate: string;
  repository: string;
  objectURL: string;
  tags: Tag[];
  objectWikidata_URL: string;
  isTimelineWork: boolean;
  GalleryNumber: string;
}

interface Constituent {
  constituentID: number;
  role: string;
  name: string;
  constituentULAN_URL: string;
  constituentWikidata_URL: string;
  gender: string;
}

interface Measurement {
  elementName: string;
  elementDescription: string;
  elementMeasurements: {
    Height: number;
    Width: number;
  };
}

interface Tag {
  term: string;
  AAT_URL: string;
  Wikidata_URL: string;
}

interface SearchResponse {
  total: number;
  objectIDs: number[];
}

interface Department {
  departmentId: number;
  displayName: string;
}

interface DepartmentsResponse {
  departments: Department[];
}

interface FavoriteArtwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImageSmall: string;
  dateAdded: string;
}
