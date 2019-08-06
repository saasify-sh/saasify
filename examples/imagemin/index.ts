import { HttpResponse} from 'fts-core'
import fileType from 'file-type'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'

export default async function optimizeImage(image: Buffer): Promise<HttpResponse> {
  const data = await imagemin.buffer(image, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant(),
      imageminWebp(),
      imageminSvgo()
    ]
	})

  const type = fileType(data)

  if (!type) {
    throw new Error('unsupported input')
  }

  return {
    headers: { 'Content-Type': type.mime },
    statusCode: 200,
    body: data
  }
}
