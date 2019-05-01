import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'

export default async function optimizeImage(image: Buffer): Promise<string> {
  const data = await imagemin.buffer(image, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant(),
      imageminWebp(),
      imageminSvgo()
    ]
	})

  return data.toString('base64')
}
