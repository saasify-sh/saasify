type BufferAlias = Buffer

export function slice(buffer: Buffer, end: number): number {
  // TODO: add support for returning buffers
  return buffer.slice(0, Math.max(0, Math.min(end, buffer.length))).length
}
