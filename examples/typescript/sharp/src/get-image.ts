import got from 'got'

export async function getImage(url: string): Promise<Buffer> {
  const res = await got(url, { encoding: null })
  return res.body
}
