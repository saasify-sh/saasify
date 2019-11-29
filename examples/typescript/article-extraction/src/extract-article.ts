import { HttpContext } from 'fts-http'

import { Article } from './types'
import extractArticleImpl from '../lib/extract-article'

export default async function extractArticle(
  url: string,
  context?: HttpContext
): Promise<Article> {
  if (context) {
    context.set(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
  }

  return extractArticleImpl(url)
}
