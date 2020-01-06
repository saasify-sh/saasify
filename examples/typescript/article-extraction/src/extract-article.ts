import { Article } from './types'
import extractArticleImpl from '../lib/extract-article'

export default async function extractArticle(url: string): Promise<Article> {
  return extractArticleImpl(url)
}
