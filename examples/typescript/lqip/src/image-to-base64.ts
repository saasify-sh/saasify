import { HttpContext } from 'fts-http'
import fs from 'fs'
import fileType from 'file-type'
import createError from 'http-errors'
import lqip from 'lqip'
import path from 'path'

export async function imageToBase64(
  input: Buffer,
  context?: HttpContext
): Promise<string> {
  if (context) {
    context.set(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
  }

  const inputType = fileType(input)

  if (!inputType) {
    throw createError(400, 'unsupported media output type\n')
  }

  const inputPath = path.join('/tmp/', `lqip.${inputType.ext}`)
  fs.writeFileSync(inputPath, input)

  const base64 = await lqip.base64(inputPath)
  return base64
}
