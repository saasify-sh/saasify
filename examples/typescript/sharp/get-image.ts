import got from 'got'

export async function getImage(url: string): Promise<Buffer> {
  return got(url).buffer()
}
