import { HttpResponse } from 'fts-core'
import fileType from 'file-type'
import pMap from 'p-map'
import sharp from 'sharp'

import { getImage } from './get-image'

type ImageOperationType =
  // Input
  'stats' | 'metadata' | 'meta' | 'limitInputPixels' |

  // Output
  'withMetadata' | 'jpeg' | 'png' | 'webp' | 'tiff' | 'raw' |

  // Resizing
  'resize' | 'extend' | 'extract' | 'trim' |

  // Compositing
  'composite' |

  // Image Manipulation
  'rotate' | 'flip' | 'flop' | 'sharpen' | 'median' | 'blur' |
  'flatten' | 'gamma' | 'negate' | 'normalise' | 'normalize' |
  'convolve' | 'threshold' | 'boolean' | 'linear' | 'recomb' |
  'modulate' |

  // Color Manipulation
  'tint' | 'greyscale' | 'grayscale' |
  'toColourspace' | 'toColorspace' | 'toColourSpace' | 'toColorSpace' |

  // Channel Manipulation
  'removeAlpha' | 'ensureAlpha' | 'extractChannel' |
  'bandBool' | 'bandbool'

interface ImageOperation {
  op: ImageOperationType
}

interface ImageOperationLimitInputPixels extends ImageOperation {
  limit: number | boolean
}

interface ImageOperationWithMetadata extends ImageOperation {
  options?: sharp.WriteableMetadata
}

interface ImageOperationJpeg extends ImageOperation {
  options?: sharp.JpegOptions
}

interface ImageOperationPng extends ImageOperation {
  options?: sharp.PngOptions
}

interface ImageOperationWebp extends ImageOperation {
  options?: sharp.WebpOptions
}

interface ImageOperationTiff extends ImageOperation {
  options?: sharp.TiffOptions
}

interface ImageOperationResize extends ImageOperation {
  options?: sharp.ResizeOptions
}

interface ImageOperationExtend extends ImageOperation {
  options?: sharp.ExtendOptions
}

interface ImageOperationExtract extends ImageOperation {
  region: sharp.Region
}

interface ImageOperationTrim extends ImageOperation {
  threshold?: number
}

interface ImageOperationComposite extends ImageOperation {
  images: sharp.OverlayOptions[]
}

interface ImageOperationRotate extends ImageOperation {
  angle?: number
  options?: sharp.RotateOptions
}

interface ImageOperationFlip extends ImageOperation {
  flip: boolean = true
}

interface ImageOperationFlop extends ImageOperation {
  flop: boolean = true
}

interface ImageOperationSharpen extends ImageOperation {
  sigma?: number
  flat?: number
  jagged?: number
}

interface ImageOperationMedian extends ImageOperation {
  size?: number
}

interface ImageOperationBlur extends ImageOperation {
  sigma?: number
}

interface ImageOperationFlatten extends ImageOperation {
  flatten?: boolean | sharp.FlattenOptions
}

interface ImageOperationGamma extends ImageOperation {
  gamma?: number
}

interface ImageOperationNegate extends ImageOperation {
  negate?: boolean
}

interface ImageOperationNormalize extends ImageOperation {
  normalize?: boolean
}

interface ImageOperationConvolve extends ImageOperation {
  kernel: sharp.Kernel
}

interface ImageOperationThreshold extends ImageOperation {
  threshold?: number
  options?: sharp.ThresholdOptions
}

interface ImageOperationBoolean extends ImageOperation {
  operand: string
  operator: string
  options?: { raw: sharp.Raw }
}

interface ImageOperationLinear extends ImageOperation {
  a?: number | null
  b?: number
}

interface ImageOperationRecomb extends ImageOperation {
  inputMatrix: sharp.Matrix3x3
}

interface ImageOperationModulate extends ImageOperation {
  options?: { brightness?: number, saturation?: number, hue?: number }
}

interface ImageOperationTint extends ImageOperation {
  rgb: string | sharp.Color
}

interface ImageOperationGreyscale extends ImageOperation {
  greyscale?: boolean
}

interface ImageOperationToColorSpace extends ImageOperation {
  colourspace?: string
  colorspace?: string
  colourSpace?: string
  colorSpace?: string
}

interface ImageOperationRemoveAlpha extends ImageOperation {
}

interface ImageOperationEnsureAlpha extends ImageOperation {
}

interface ImageOperationExtractChannel extends ImageOperation {
  channel: number | string
}

interface ImageOperationBandBool extends ImageOperation {
  boolOp: string
}

function getInlineImage (input: string | Buffer | {create: sharp.Create}) {
  if (typeof input === 'string') {
    return getImage(input)
  } else {
    return input
  }
}

export default async function process(
  input?: string,
  options?: sharp.SharpOptions,
  ops?: ImageOperation[]
): Promise<HttpResponse> {
  let pipeline

  if (input) {
    const image = await getImage(input)
    pipeline = sharp(image, options)
  } else if (options && options.create) {
    pipeline = sharp(options)
  } else {
    const err = new Error(`Must provide either an "input" url or "options.create" to create an image from scratch`)
    err.statusCode = 400
    throw err
  }

  let pipelineIsImage = true

  function ensurePipelineIsImage (op: ImageOperationType) {
    if (!pipelineIsImage) {
      const err = new Error(`Error processing operations at operation "${op}"`)
      err.statusCode = 400
      throw err
    }
  }

  if (ops) {
    for (const imageOperation of ops) {
      switch (imageOperation.op) {
        // Input

        case 'stats':
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.stats()
          pipelineIsImage = false
          break

        case 'metadata':
        case 'meta':
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.stats()
          pipelineIsImage = false
          break

        case 'limitInputPixels': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationLimitInputPixels)
          pipeline = pipeline.limitInputPixels(op.limit)
        }

        // Output

        case 'withMetadata': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationWithMetadata)
          pipeline = pipeline.withMetadata(op.options)
        }

        case 'jpeg': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationJpeg)
          pipeline = pipeline.jpeg(op.options)
        }

        case 'png': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationPng)
          pipeline = pipeline.jpeg(op.options)
        }

        case 'webp': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationWebp)
          pipeline = pipeline.webp(op.options)
        }

        case 'raw': {
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.raw()
        }

        // Resizing

        case 'resize': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationResize)
          pipeline = pipeline.resize(op.options)
        }

        case 'extend': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtend)
          pipeline = pipeline.extend.(op.options)
        }

        case 'extract': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtract)
          pipeline = pipeline.extract(op.region)
        }

        case 'trim': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationTrim)
          pipeline = pipeline.trim(op.threshold)
        }

        // Compositing

        case 'composite': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationComposite)
          const images = await pMap((op.images || []), async (image) => ({
            ...image,
            input: await getInlineImage(image.input)
          }), {
            concurrency: 3
          })
          pipeline = pipeline.composite(images)
        }

        // Image Manipulation

        case 'rotate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRotate)
          pipeline = pipeline.rotate(op.angle, op.options)
        }

        case 'flip': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlip)
          pipeline = pipeline.flip(op.flip)
        }

        case 'flop': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlop)
          pipeline = pipeline.flop(op.flop)
        }

        case 'sharpen': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationSharpen)
          pipeline = pipeline.sharpen(op.sigma, op.flat, op.jagged)
        }

        case 'median': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationMedian)
          pipeline = pipeline.median(op.size)
        }

        case 'blur': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBlur)
          pipeline = pipeline.blur(op.sigma)
        }

        case 'flatten': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlatten)
          pipeline = pipeline.flatten(op.flatten)
        }

        case 'gamma': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationGamma)
          pipeline = pipeline.gamma(op.gamma)
        }

        case 'negate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationNegate)
          pipeline = pipeline.negate(op.negate)
        }

        case 'normalise':
        case 'normalize': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationNormalize)
          pipeline = pipeline.(op.normalize)
        }

        case 'convolve': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationConvolve)
          pipeline = pipeline.convolve(op.kernel)
        }

        case 'threshold': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationThreshold)
          pipeline = pipeline.threshold(op.threshold, op.options)
        }

        case 'boolean': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBoolean)
          pipeline = pipeline.boolean(op.operand, op.operator, op.options)
        }

        case 'linear': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationLinear)
          pipeline = pipeline.linear(op.a, op.b)
        }

        case 'recomb': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRecomb)
          pipeline = pipeline.recomb(op.inputMatrix)
        }

        case 'modulate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationModulate)
          pipeline = pipeline.modulate(op.options)
        }

        // Color Manipulation

        case 'tint': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationTint)
          pipeline = pipeline.tint(op.rgb)
        }

        case 'grayscale':
        case 'greyscale': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationGreyscale)
          pipeline = pipeline.(op.greyscale)
        }

        case 'toColourSpace':
        case 'toColourspace':
        case 'toColorSpace':
        case 'toColorspace': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationToColorSpace)
          const colorSpace: string = op.colorspace || op.colorSpace || op.colourspace || op.colourSpace
          pipeline = pipeline.(colorSpace || undefined)
        }

        // Channel Manipulation

        case 'removeAlpha': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRemoveAlpha)
          pipeline = pipeline.removeAlpha()
        }

        case 'ensureAlpha': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationEnsureAlpha)
          pipeline = pipeline.ensureAlpha()
        }

        case 'extractChannel': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtractChannel)
          pipeline = pipeline.extractChannel(op.channel)
        }

        case 'bandBool':
        case 'bandbool': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBandBool)
          pipeline = pipeline.(op.boolOp)
        }

        default: {
          const err = new Error(`Unsupported image operation "${imageOperation.op}"`)
          err.statusCode = 400
          throw err
        }
      }
    }
  }

  let body
  let contentType

  if (pipelineIsImage) {
    body = await pipeline.toBuffer()
    const type = fileType(body)
    if (!type) {
      throw new Error('Unrecognized output mime type')
    }

    contentType = type.mime
  } else {
    body = await pipeline
    contentType = 'application/json'
  }

  return {
    headers: { 'Content-Type': contentType },
    statusCode: 200,
    body
  }
}
