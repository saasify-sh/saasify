// screenshot.ts
import { HttpResponse } from 'fts-core'

// Note how we're able to pull the types directly from "@types/puppeteer-core"
import {
  DirectNavigationOptions,
  BinaryScreenShotOptions,
  Viewport
} from 'puppeteer-core'

import { getPage } from './lib/page'
import { ImageFormat, Rect } from './lib/types'

/**
 * Navigates to a page and captures a screenshot via Puppeteer's [Page.screenshot](https://pptr.dev/#?product=Puppeteer&version=v1.19.0&show=api-pagescreenshotoptions).
 *
 * @param url - URL to navigate page to. The url should include scheme, e.g. `https://`.
 * @param type - Specify screenshot type, can be either `jpeg` or `png`.
 * @param quality - The quality of the image, between 0-100. Not applicable to `png` images.
 * @param fullPage - When `true`, takes a screenshot of the full scrollable page.
 * @param omitBackground -  Hides default white background and allows capturing screenshots with transparency.
 * @param clip - An object which specifies clipping region of the page.
 * @param gotoOptions - Customize the `Page.goto` navigation options.
 * @param viewport - Set the browser window's viewport dimensions and/or resolution.
 * @param userAgent - Set the browser's [user-agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent).
 * @param emulateDevice - Make it look like the screenshot was taken on the specified device.
 * - Use the `name` property from one of the built-in [devices](https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js).
 * - Overrides `viewport` and `userAgent`.
 *
 * @return Image as either `image/png` or `image/jpeg` depending on the `type` parameter.
 */
export default async function screenshot(
  url: string,
  type: ImageFormat = 'png',
  quality: number = 100,
  fullPage: boolean = false,
  omitBackground: boolean = true,
  clip?: Rect,
  gotoOptions?: DirectNavigationOptions,
  viewport?: Viewport,
  userAgent?: string,
  emulateDevice?: string
): Promise<HttpResponse> {
  const page = await getPage({
    url,
    gotoOptions,
    viewport,
    userAgent,
    emulateDevice
  })

  const opts: BinaryScreenShotOptions = {
    type,
    fullPage,
    omitBackground,
    clip
  }

  if (type === 'jpeg') {
    opts.quality = quality
  }

  const body = await page.screenshot(opts)
  await page.close()

  return {
    headers: {
      'Content-Type': (type === 'png' ? 'image/png' : 'image/jpeg')
    },
    statusCode: 200,
    body
  }
}
