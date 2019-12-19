import { HttpResponse } from 'fts-core'
import { HttpContext } from 'fts-http'
import fileType from 'file-type'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminOptipng from 'imagemin-optipng'
import imageminPngcrush from 'imagemin-pngcrush'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import imageminGifsicle from 'imagemin-gifsicle'
import pMap from 'p-map'
import pPipe from 'p-pipe'

// TODO:
// - https://github.com/imagemin/imagemin-jpegoptim
// - https://github.com/imagemin/imagemin-zopfli
// - https://github.com/imagemin/imagemin-advpng

interface Pipeline {
  name: string
  plugins: imagemin.Plugin[]
}

interface PipelineMap {
  [type: string]: Pipeline[]
}

// workaround instead of using `imagemin.buffer` directly until this ZEIT now bug is fixed
// https://spectrum.chat/zeit/now/cannot-find-module-nodelib-fs-stat~62fe9614-fd8c-4f25-ade4-8f6fd4f611c2
// (this happens when we import imagemin which transitively imports fast-glob)
const imageminBuffer = async (
  input: Buffer,
  { plugins = [] } = {}
): Promise<Buffer> => {
  if (!Buffer.isBuffer(input)) {
    throw new TypeError(`Expected a \`Buffer\`, got \`${typeof input}\``)
  }

  if (plugins.length === 0) {
    return input
  }

  return (pPipe(...plugins)(input) as any) as Buffer
}

const mimeTypeToPipelines: PipelineMap = {
  'image/png': [{ name: 'pngquant', plugins: [imageminPngquant()] }],
  'image/jpeg': [
    {
      name: 'jpegtran, mozjpeg',
      plugins: [imageminJpegtran(), imageminMozjpeg()]
    }
  ],
  'image/webp': [{ name: 'webp', plugins: [imageminWebp()] }],
  'image/svg+xml': [{ name: 'svgo', plugins: [imageminSvgo()] }],
  'image/gif': [{ name: 'gifsicle', plugins: [imageminGifsicle()] }]
}

/**
 * Optimizes an image
 *
 * @param input Image buffer to optimize
 */
export default async function optimizeImage(
  input: Buffer
): Promise<HttpResponse> {
  const inputType = fileType(input)
  let pipelines: Pipeline[]

  if (!inputType || !(pipelines = mimeTypeToPipelines[inputType.mime])) {
    console.log({ inputType })
    console.log(input)
    console.log(input.byteLength)
    throw new Error('unsupported media type\n')
  }

  let body = input
  let bestPipeline = 'identity'
  console.log({ inputType, pipeline: 'identity', length: body.byteLength })

  await pMap(
    pipelines,
    async (pipeline) => {
      try {
        console.time(pipeline.name)
        const result = await imageminBuffer(input, pipeline)
        console.log({ pipeline: pipeline.name, length: result.byteLength })

        if (result.byteLength < body.byteLength) {
          body = result
          bestPipeline = pipeline.name
        }

        console.timeEnd(pipeline.name)
      } catch (err) {
        console.error(`error processing pipeline "${pipeline.name}"`, err)
      }
    },
    {
      concurrency: 2
    }
  )

  const outputType = fileType(body)

  console.log({ outputType, pipeline: bestPipeline, length: body.byteLength })
  if (!outputType) {
    throw new Error('unsupported media output type\n')
  }

  return {
    headers: { 'Content-Type': outputType.mime },
    statusCode: 200,
    body
  }
}
