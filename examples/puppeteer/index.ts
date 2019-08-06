const { HttpResponse} = require('fts-core')
const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

type ImageFormat = 'png' | 'jpg'

export default async function getScreenshot(url: string, type: ImageFormat = 'png'): Promise<HttpResponse> {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  })

  const page = await browser.newPage()
  await page.goto(url)

  const file = await page.screenshot({ type })
  await browser.close()

  return {
    headers: {
      'Content-Type': (type === 'png' ? 'image/png' : 'image/jpeg')
    },
    statusCode: 200,
    body: file
  }
}

