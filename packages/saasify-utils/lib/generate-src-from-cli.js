const fs = require('fs-extra')

module.exports = async (destination, service) => {
  const { run } = service

  // TODO add typed inputs based on service.schema
  const src = `
import { HttpResponse } from 'fts-core'
import { handleCliService } from 'saasify-utils'

export default async function ${service.name}(
  input: Buffer,
  ...options: any[]
): Promise<HttpResponse> {
  return handleCliService('${run}', input, options)
}
`

  fs.writeFileSync(destination, src)

  return destination
}
