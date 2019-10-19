import { HttpResponse} from 'fts-core'
import fileType from 'file-type'
import * as fs from 'fs'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import pPipe from 'p-pipe'

const image = fs.readFileSync('./nala.jpg')

// workaround instead of using `imagemin.buffer` directly until this ZEIT now bug is fixed
// https://spectrum.chat/zeit/now/cannot-find-module-nodelib-fs-stat~62fe9614-fd8c-4f25-ade4-8f6fd4f611c2
// (this happens when we import imagemin which transitively imports fast-glob)
const imageminBuffer = async (input: Buffer, {plugins = []} = {}): Promise<Buffer> => {
	if (!Buffer.isBuffer(input)) {
		throw new TypeError(`Expected a \`Buffer\`, got \`${typeof input}\``)
	}

	if (plugins.length === 0) {
		return input
	}

	return ((pPipe(...plugins)(input) as any) as Buffer)
}

export default async function optimizeImage(): Promise<HttpResponse> {
  const data = await imageminBuffer(image, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant(),
      imageminWebp(),
      imageminSvgo()
    ]
	})

  const type = fileType(data)

  if (!type) {
    throw new Error('unsupported media type')
  }

  return {
    headers: { 'Content-Type': type.mime },
    statusCode: 200,
    body: data
  }
}
