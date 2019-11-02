import { HttpResponse } from 'fts-core'
import fileType from 'file-type'

import {
  RemoveBgOptions,
  removeBackgroundFromImageBase64
} from './remove-bg'

import { convertResult } from './convert-result'

/**
 * Removes the background from an image using a smart deep learning algorithm.
 *
 * Takes in a raw binary image as the request body.
 *
 * Note that this service exists for convenience. We recommend using the other services
 * for processing `base64` or `url` images because they are much more customizable.
 */
export async function removeBgRaw(input: Buffer): Promise<HttpResponse> {
  const inputType = fileType(input)

  if (!inputType) {
    throw new Error('unsupported media type\n')
  }

  const base64img = input.toString('base64')
  const result = await removeBackgroundFromImageBase64({
    base64img
  })

  return convertResult(result, false)
}
