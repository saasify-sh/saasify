import checkLinksImpl from 'check-links'
import { LivenessResult, RawLivenessResult, CheckLinksOptions } from './types'

export default async function checkLinks(
  urls: string[],
  opts?: CheckLinksOptions
): Promise<LivenessResult[]> {
  const results: { [key: string]: RawLivenessResult } = await checkLinksImpl(
    urls,
    opts
  )

  return urls.map((url) => ({ url, ...results[url] }))
}
