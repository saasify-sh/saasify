export function base64ToBuffer(input: string): Buffer {
  const [_, data] = input.split(',')
  return Buffer.from(data, 'base64')
}
