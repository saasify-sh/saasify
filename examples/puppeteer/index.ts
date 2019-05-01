const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

type ImageFormat = 'png' | 'jpg'

export default async function getScreenshot( url: string, type: ImageFormat = 'png'): Promise<string> {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  })

  const page = await browser.newPage()
  await page.goto(url)

  const file = await page.screenshot({ type, encoding: 'base64' })
  await browser.close()

  return file
}

