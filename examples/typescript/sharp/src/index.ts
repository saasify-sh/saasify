import { HttpResponse } from 'fts-core'
import fileType = require('file-type')
import pMap = require('p-map')
import sharp = require('sharp')

import { getImage } from './get-image'

type ImageOperationType =
  // Input
  'metadata' | 'stats' | 'meta' | 'limitInputPixels' |

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
  flip?: boolean
}

interface ImageOperationFlop extends ImageOperation {
  flop?: boolean
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

type AnyImageOperation =
  ImageOperation |
  ImageOperationLimitInputPixels |
  ImageOperationWithMetadata |
  ImageOperationJpeg |
  ImageOperationPng |
  ImageOperationWebp |
  ImageOperationTiff |
  ImageOperationResize |
  ImageOperationExtend |
  ImageOperationExtract |
  ImageOperationTrim |
  ImageOperationComposite |
  ImageOperationRotate |
  ImageOperationFlip |
  ImageOperationFlop |
  ImageOperationSharpen |
  ImageOperationMedian |
  ImageOperationBlur |
  ImageOperationFlatten |
  ImageOperationGamma |
  ImageOperationNegate |
  ImageOperationNormalize |
  ImageOperationConvolve |
  ImageOperationThreshold |
  ImageOperationBoolean |
  ImageOperationLinear |
  ImageOperationRecomb |
  ImageOperationModulate |
  ImageOperationTint |
  ImageOperationGreyscale |
  ImageOperationToColorSpace |
  ImageOperationRemoveAlpha |
  ImageOperationEnsureAlpha |
  ImageOperationExtractChannel |
  ImageOperationBandBool

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
  ops?: AnyImageOperation[]
): Promise<HttpResponse> {
  console.log({ input, ops, options })

  let pipeline

  if (input) {
    const image = await getImage(input)
    pipeline = sharp(image, options)
  } else if (options && options.create) {
    pipeline = sharp(options)
  } else {
    const err = new Error(`Must provide either an "input" url or "options.create" to create an image from scratch`)
    // err.statusCode = 400
    throw err
  }

  let pipelineIsImage = true

  function ensurePipelineIsImage (op: ImageOperationType) {
    if (!pipelineIsImage) {
      const err = new Error(`Error processing operations at operation "${op}"`)
      // err.statusCode = 400
      throw err
    }
  }

  if (ops) {
    for (const imageOperation of ops) {
      switch (imageOperation.op) {
        // Input

        case 'metadata':
        case 'meta': {
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.metadata()
          pipelineIsImage = false
          break
        }

        case 'stats': {
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.stats()
          pipelineIsImage = false
          break
        }

        case 'limitInputPixels': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationLimitInputPixels)
          pipeline = pipeline.limitInputPixels(op.limit)
          break
        }

        // Output

        case 'withMetadata': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationWithMetadata)
          pipeline = pipeline.withMetadata(op.options)
          break
        }

        case 'jpeg': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationJpeg)
          pipeline = pipeline.jpeg(op.options)
          break
        }

        case 'png': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationPng)
          pipeline = pipeline.jpeg(op.options)
          break
        }

        case 'webp': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationWebp)
          pipeline = pipeline.webp(op.options)
          break
        }

        case 'raw': {
          ensurePipelineIsImage(imageOperation.op)
          pipeline = pipeline.raw()
          break
        }

        // Resizing

        case 'resize': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationResize)
          pipeline = pipeline.resize(op.options)
          break
        }

        case 'extend': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtend)
          pipeline = pipeline.extend(op.options)
          break
        }

        case 'extract': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtract)
          pipeline = pipeline.extract(op.region)
          break
        }

        case 'trim': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationTrim)
          pipeline = pipeline.trim(op.threshold)
          break
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
          break
        }

        // Image Manipulation

        case 'rotate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRotate)
          pipeline = pipeline.rotate(op.angle, op.options)
          break
        }

        case 'flip': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlip)
          pipeline = pipeline.flip(op.flip)
          break
        }

        case 'flop': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlop)
          pipeline = pipeline.flop(op.flop)
          break
        }

        case 'sharpen': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationSharpen)
          pipeline = pipeline.sharpen(op.sigma, op.flat, op.jagged)
          break
        }

        case 'median': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationMedian)
          pipeline = pipeline.median(op.size)
          break
        }

        case 'blur': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBlur)
          pipeline = pipeline.blur(op.sigma)
          break
        }

        case 'flatten': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationFlatten)
          pipeline = pipeline.flatten(op.flatten)
          break
        }

        case 'gamma': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationGamma)
          pipeline = pipeline.gamma(op.gamma)
          break
        }

        case 'negate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationNegate)
          pipeline = pipeline.negate(op.negate)
          break
        }

        case 'normalise':
        case 'normalize': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationNormalize)
          pipeline = pipeline.normalize(op.normalize)
          break
        }

        case 'convolve': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationConvolve)
          pipeline = pipeline.convolve(op.kernel)
          break
        }

        case 'threshold': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationThreshold)
          pipeline = pipeline.threshold(op.threshold, op.options)
          break
        }

        case 'boolean': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBoolean)
          pipeline = pipeline.boolean(op.operand, op.operator, op.options)
          break
        }

        case 'linear': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationLinear)
          pipeline = pipeline.linear(op.a, op.b)
          break
        }

        case 'recomb': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRecomb)
          pipeline = pipeline.recomb(op.inputMatrix)
          break
        }

        case 'modulate': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationModulate)
          pipeline = pipeline.modulate(op.options)
          break
        }

        // Color Manipulation

        case 'tint': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationTint)
          pipeline = pipeline.tint(op.rgb)
          break
        }

        case 'grayscale':
        case 'greyscale': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationGreyscale)
          pipeline = pipeline.greyscale(op.greyscale)
          break
        }

        case 'toColourSpace':
        case 'toColourspace':
        case 'toColorSpace':
        case 'toColorspace': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationToColorSpace)
          const colorSpace: string = op.colorspace || op.colorSpace || op.colourspace || op.colourSpace
          pipeline = pipeline.toColorspace(colorSpace || undefined)
          break
        }

        // Channel Manipulation

        case 'removeAlpha': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationRemoveAlpha)
          pipeline = pipeline.removeAlpha()
          break
        }

        case 'ensureAlpha': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationEnsureAlpha)
          pipeline = pipeline.ensureAlpha()
          break
        }

        case 'extractChannel': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationExtractChannel)
          pipeline = pipeline.extractChannel(op.channel)
          break
        }

        case 'bandBool':
        case 'bandbool': {
          ensurePipelineIsImage(imageOperation.op)
          const op = (imageOperation as ImageOperationBandBool)
          pipeline = pipeline.bandbool(op.boolOp)
          break
        }

        default: {
          const err = new Error(`Unsupported image operation "${imageOperation.op}"`)
          // err.statusCode = 400
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
    console.log(body)
    contentType = 'application/json'
  }

  return {
    headers: { 'Content-Type': contentType },
    statusCode: 200,
    body
  }
}
