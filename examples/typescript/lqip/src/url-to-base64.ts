import { HttpContext } from 'fts-http'
import { getImage } from './get-image'
import { imageToBase64 } from './image-to-base64'

export async function urlToBase64(
  url: string,
  context?: HttpContext
): Promise<string> {
  const input = await getImage(url)
  return imageToBase64(input, context)
}
