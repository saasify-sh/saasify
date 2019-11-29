export interface CoreMediaAsset {
  type: string
  url: string
  width: number
  height: number
}

export interface MediaAsset extends CoreMediaAsset {
  render: CoreMediaAsset
  source: MediaSource
}

export interface MediaSource {
  provider: string
  label: string
  link: string
  id: string
  query: string
  user?: MediaSourceUser
}

export interface MediaSourceUser {
  id: string
  name?: string
  username?: string
  link?: string
}

export interface SearchResults {
  metadata: SearchMetadata
  results: MediaAsset[]
}

export interface SearchMetadata {
  [provider: string]: ProviderSearchMetadata
}

export interface ProviderSearchMetadata {
  limit: number
  offset: number
}
