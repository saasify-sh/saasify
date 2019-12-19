import { HttpResponse } from 'fts-core'
import { getImage } from './get-image'
import optimizeImage from '.'

/**
 * Optimizes an image for a given a URL
 *
 * @param url URL of the image
 */
export default async function optimizeImageUrl(
  url: string
): Promise<HttpResponse> {
  const image = await getImage(url)

  return optimizeImage(image)
}
