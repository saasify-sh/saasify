import { getOptions } from './options'
import { HttpResponse } from 'fts-core'
import { launch, Page } from 'puppeteer-core'

type ImageFormat = 'png' | 'jpeg'

let _page: Page | null

const isDev = process.env.NOW_REGION === 'dev1'

export default async function getScreenshot(url: string, type: ImageFormat = 'png'): Promise<HttpResponse> {
  const page = await getPage(isDev)
  await page.goto(url)
  const file = await page.screenshot({ type })

  console.log({ file })
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
