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
): Promise<string> {
  return textP(text, {
    font,
    horizontalLayout,
    verticalLayout
  })
}
