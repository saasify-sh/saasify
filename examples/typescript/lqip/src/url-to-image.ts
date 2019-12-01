import { HttpResponse } from 'fts-core'
import { HttpContext } from 'fts-http'
import fileType from 'file-type'
import createError from 'http-errors'

import { base64ToBuffer } from './base64-to-buffer'
import { urlToBase64 } from './url-to-base64'

export async function urlToImage(
  url: string,
  context?: HttpContext
): Promise<HttpResponse> {
  const image = await urlToBase64(url, context)

  const output = base64ToBuffer(image)
  const outputType = fileType(output)

  if (!outputType) {
    throw createError(400, 'unsupported media output type\n')
  }

  return {
    headers: { 'Content-Type': outputType.mime },
    statusCode: 200,
    body: output
  }
}
