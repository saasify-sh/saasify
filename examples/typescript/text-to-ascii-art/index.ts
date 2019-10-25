import { HttpContext } from 'fts-http'
import figlet from 'figlet'
import pify from 'pify'

import { Font } from './fonts'

type Layout = 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'

const textP = pify(figlet.text)

export default async function textToAsciiArt(
  text: string,
  font: Font = 'Standard',
  horizontalLayout: Layout = 'default',
  verticalLayout: Layout = 'default',
  context: HttpContext
): Promise<string> {
  context.set('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)

  return textP(text, {
    font,
    horizontalLayout,
    verticalLayout
  })
}
