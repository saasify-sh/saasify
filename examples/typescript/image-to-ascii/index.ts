import asciify from 'image-to-ascii'
import pify from 'pify'

// TODO: add size options

export default async function imageToAscii(
  url: string,
  pxWidth: number = 2,
  pixels: string = ' .,:;i1tfLCG08@',
  reverse: boolean = false,
  colored: boolean = true,
  bg: boolean = false,
  fg: boolean = true,
  white_bg: boolean = true,
): Promise<string> {
  return pify(asciify)(url, {
    pxWidth,
    pixels,
    reverse,
    colored,
    bg,
    fg,
    white_bg
  })
}
