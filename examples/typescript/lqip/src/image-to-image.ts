import { HttpResponse } from 'fts-core'
import { HttpContext } from 'fts-http'
import fileType from 'file-type'
import createError from 'http-errors'

import { imageToBase64 } from './image-to-base64'
import { base64ToBuffer } from './base64-to-buffer'

export async function imageToImage(
  input: Buffer,
  context?: HttpContext
): Promise<HttpResponse> {
  const image = await imageToBase64(input, context)
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
