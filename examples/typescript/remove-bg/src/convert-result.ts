import { HttpResponse } from 'fts-core'
import fileType from 'file-type'

import {
  RemoveBgResult
} from './remove-bg'

export async function convertResult(
  result: RemoveBgResult,
  json: boolean
): Promise<HttpResponse> {
  if (json) {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: Buffer.from(JSON.stringify(result), 'utf8')
    }
  }

  const body = Buffer.from(result.base64img, 'base64')
  const outputType = fileType(body)

  if (!outputType) {
    throw new Error('unsupported media type\n')
  }

  return {
    headers: { 'Content-Type': outputType.mime },
    statusCode: 200,
    body
  }
}
