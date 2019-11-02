import { HttpResponse } from 'fts-core'
import { getImage } from './get-image'
import optimizeImage from '.'

export default async function optimizeImageUrl(url: string): Promise<HttpResponse> {
  const image = await getImage(url)

  return optimizeImage(image)
}
