import { TesseractWorker } from 'tesseract.js'
import * as path from 'path'

import { Page } from './types'

const worker = new TesseractWorker({
  langPath: path.join(__dirname, 'data')
})

export default async function recognize(
  url: string
): Promise<Page> {
  const result = await worker
    .recognize(url)
    .progress((info) => {
      console.log(info)
    })

  return result
}
