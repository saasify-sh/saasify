// TODO: we need a better way of getting the output type in non-rgb formats

import { HttpContext } from 'fts-http'
import Color from 'color'

type ColorParam = string | number[] | number | { [key: string]: any }

type OutputFormat =
  | 'string'
  | 'object'
  | 'array'
  | 'unitArray'
  | 'unitObject'
  | 'keyword'
  | 'hex'
  | 'rgbNumber'
  | 'luminosity'
  // | 'contrast' TODO
  | 'isDark'
  | 'isLight'

type ColorType =
  | 'rgb'
  | 'hsl'
  | 'hsv'
  | 'hwb'
  | 'cmyk'
  | 'xyz'
  | 'lab'
  | 'lch'
  | 'ansi16'
  | 'ansi256'
  | 'hcg'
  | 'apple'

type ColorOperationType =
  | 'negate'
  | 'lighten'
  | 'darken'
  | 'saturate'
  | 'desaturate'
  | 'whiten'
  | 'blacken'
  | 'grayscale'
  | 'fade'
  | 'opaquer'
  | 'rotate'
  | 'mix'
  | 'round'

interface ColorOperation {
  op: ColorOperationType
}

interface ColorOperationNegate extends ColorOperation {}

interface ColorOperationLighten extends ColorOperation {
  ratio: number
}

interface ColorOperationDarken extends ColorOperation {
  ratio: number
}

interface ColorOperationSaturate extends ColorOperation {
  ratio: number
}

interface ColorOperationDesaturate extends ColorOperation {
  ratio: number
}

interface ColorOperationWhiten extends ColorOperation {
  ratio: number
}

interface ColorOperationBlacken extends ColorOperation {
  ratio: number
}

interface ColorOperationGrayscale extends ColorOperation {}

interface ColorOperationFade extends ColorOperation {
  ratio: number
}

interface ColorOperationOpaquer extends ColorOperation {
  ratio: number
}

interface ColorOperationRotate extends ColorOperation {
  degrees: number
}

interface ColorOperationMix extends ColorOperation {
  mixinColor: ColorParam
  mixinColorType?: ColorType
  weight?: number
}

interface ColorOperationRound extends ColorOperation {
  places?: number
}

type AnyColorOperation =
  | ColorOperation
  | ColorOperationNegate
  | ColorOperationLighten
  | ColorOperationDarken
  | ColorOperationSaturate
  | ColorOperationDesaturate
  | ColorOperationWhiten
  | ColorOperationBlacken
  | ColorOperationGrayscale
  | ColorOperationFade
  | ColorOperationOpaquer
  | ColorOperationRotate
  | ColorOperationMix
  | ColorOperationRound

export default function convert(
  input: string,
  inputType?: ColorType,
  ops?: AnyColorOperation[],
  outputType?: ColorType,
  outputFormat?: OutputFormat,
  context?: HttpContext
): any {
  if (context) {
    context.set(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
  }

  const inputColor = getColor(input, inputType)
  let currentColor = inputColor

  if (ops) {
    for (const colorOperation of ops) {
      switch (colorOperation.op) {
        case 'negate': {
          const op = colorOperation as ColorOperationNegate
          currentColor = currentColor.negate()
          break
        }
        case 'lighten': {
          const op = colorOperation as ColorOperationLighten
          currentColor = currentColor.lighten(op.ratio)
          break
        }
        case 'darken': {
          const op = colorOperation as ColorOperationDarken
          currentColor = currentColor.darken(op.ratio)
          break
        }
        case 'saturate': {
          const op = colorOperation as ColorOperationSaturate
          currentColor = currentColor.saturate(op.ratio)
          break
        }
        case 'desaturate': {
          const op = colorOperation as ColorOperationDesaturate
          currentColor = currentColor.desaturate(op.ratio)
          break
        }
        case 'whiten': {
          const op = colorOperation as ColorOperationWhiten
          currentColor = currentColor.whiten(op.ratio)
          break
        }
        case 'blacken': {
          const op = colorOperation as ColorOperationBlacken
          currentColor = currentColor.blacken(op.ratio)
          break
        }
        case 'grayscale': {
          const op = colorOperation as ColorOperationGrayscale
          currentColor = currentColor.grayscale()
          break
        }
        case 'fade': {
          const op = colorOperation as ColorOperationFade
          currentColor = currentColor.fade(op.ratio)
          break
        }
        case 'opaquer': {
          const op = colorOperation as ColorOperationOpaquer
          currentColor = currentColor.opaquer(op.ratio)
          break
        }
        case 'rotate': {
          const op = colorOperation as ColorOperationRotate
          currentColor = currentColor.rotate(op.degrees)
          break
        }
        case 'mix': {
          const op = colorOperation as ColorOperationMix
          const mixinColor = getColor(op.mixinColor, op.mixinColorType)
          currentColor = currentColor.mix(mixinColor, op.weight)
          break
        }
        case 'round': {
          const op = colorOperation as ColorOperationRound
          currentColor = currentColor.round(op.places)
          break
        }
        default:
          console.log('warning unrecognized color operation', colorOperation.op)
          // TODO: warn?
          break
      }
    }
  }

  if (outputType) {
    currentColor = convertColor(currentColor, outputType)
  }

  if (!outputFormat) {
    if ((currentColor as any).model === 'rgb') {
      outputFormat = 'hex'
    } else {
      outputFormat = 'object'
    }
  }

  return getColorInFormat(currentColor, outputFormat)
}

function getColor(input: ColorParam, inputType?: ColorType) {
  try {
    if (typeof input === 'string') {
      input = JSON.parse(input)
    }
  } catch (err) {}

  switch (inputType) {
    case 'rgb':
      return Color.rgb(input)
    case 'hsl':
      return Color.hsl(input)
    case 'hsv':
      return Color.hsv(input)
    case 'hwb':
      return Color.hwb(input)
    case 'cmyk':
      return Color.cmyk(input)
    case 'xyz':
      return Color.xyz(input)
    case 'lab':
      return Color.lab(input)
    case 'lch':
      return Color.lch(input)
    case 'ansi16':
      return Color.ansi16(input)
    case 'ansi256':
      return Color.ansi256(input)
    case 'hcg':
      return Color.hcg(input)
    case 'apple':
      return Color.apple(input)
    default:
      return Color(input)
  }
}

function convertColor(input: Color, inputType?: ColorType) {
  switch (inputType) {
    case 'rgb':
      return input.rgb()
    case 'hsl':
      return input.hsl()
    case 'hsv':
      return input.hsv()
    case 'hwb':
      return input.hwb()
    case 'cmyk':
      return input.cmyk()
    case 'xyz':
      return input.xyz()
    case 'lab':
      return input.lab()
    case 'lch':
      return input.lch()
    case 'ansi16':
      return input.ansi16()
    case 'ansi256':
      return input.ansi256()
    case 'hcg':
      return input.hcg()
    case 'apple':
      return input.apple()
    default:
      return input
  }
}

function getColorInFormat(color: Color, format: OutputFormat): any {
  switch (format) {
    case 'string':
      return color.string()
    case 'object':
      return color.object()
    case 'array':
      return color.array()
    case 'unitArray':
      return color.unitArray()
    case 'unitObject':
      return color.unitObject()
    case 'keyword':
      return color.keyword()
    case 'hex':
      return color.hex()
    case 'rgbNumber':
      return color.rgbNumber()
    case 'luminosity':
      return color.luminosity()
    case 'isDark':
      return color.isDark()
    case 'isLight':
      return color.isLight()
    default:
      return color.string()
  }
}
