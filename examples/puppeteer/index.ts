import { getOptions } from './options'
import { HttpResponse } from 'fts-core'
import { launch, Page, DirectNavigationOptions } from 'puppeteer-core'

import { ImageFormat, Rect } from './types'

const isDev = process.env.NOW_REGION === 'dev1'

// cache the current page / browser between serverless invocations
let _page: Page | null

export default async function getScreenshot(
  url: string,
  type: ImageFormat = 'png',
  quality: number = 100,
  fullPage: boolean = false,
  omitBackground: boolean = true,
  clip: Rect = undefined,
  gotoOptions: Partial<DirectNavigationOptions> = undefined
): Promise<HttpResponse> {
  const page = await getPage(isDev)
  await page.goto(url, gotoOptions)
  const file = await page.screenshot({
    type,
    quality,
    fullPage,
    omitBackground,
    clip
  })

  return {
    headers: {
      'Content-Type': (type === 'png' ? 'image/png' : 'image/jpeg')
    },
    statusCode: 200,
    body: file
  }
}

async function getPage(isDev: boolean) {
  if (_page) {
    return _page
  }
  const options = await getOptions(isDev)
  const browser = await launch(options)
  _page = await browser.newPage()
  return _page
}
