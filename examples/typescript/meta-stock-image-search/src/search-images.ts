import { HttpContext } from 'fts-http'

import { MediaAsset, SearchResults, SearchMetadata } from './types'
import searchImagesImpl from '../lib/images'

export default async function searchImages(
  query: string = '',
  offset: number = 0,
  limit: number = 25,
  metadata?: SearchMetadata,
  context?: HttpContext
): Promise<SearchResults> {
  if (context) {
    context.set(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
  }

  const result = await searchImagesImpl({ query, offset, limit, metadata })
  // console.log(JSON.stringify(result.results.slice(0, 3), null, 2))

  return result
}
