'use strict'

const delay = require('delay')
const findFreePort = require('find-free-port')
const got = require('got')
const pRetry = require('p-retry')
const path = require('path')
const { parseOpenAPI, convertOpenAPIToServices } = require('saasify-utils')

const killProcessTree = require('../kill-process-tree')
const serveProjectLocal = require('../serve-project-local')

module.exports = async (opts) => {
  const { program, config, serveProjectLocal, ...rest } = opts

  // TODO: relax restriction on only having one source FastAPI file
  const src = config.services[0].src
  for (const service of config.services) {
    if (service.src !== src) {
      throw new Error(
        `Python only supports a single src file: found "${src}" and "${service.src}"`
      )
    }
  }

  if (serveProjectLocal === false) {
    return config
  }

  const openapi = await module.exports.extractOpenAPI({
    program,
    config,
    service: config.services[0],
    ...rest
  })

  const openapiResolved = await parseOpenAPI(openapi)
  const services = await convertOpenAPIToServices(openapiResolved)

  return {
    ...config,
    openapi,
    services
  }
}

// TODO: find a less hacky approach for extracting the openapi schema
module.exports.extractOpenAPI = async (opts) => {
  const { program, config, service, ...rest } = opts

  const src = path.resolve(config.root, service.src)
  const srcRelative = path.relative(process.cwd(), src)
  console.log(`parsing service ${srcRelative}`)

  const [port] = await findFreePort(8761)

  const serve = await serveProjectLocal(program, config, {
    ...rest,
    pipe: !!program.debug,
    listen: port
  })

  const child = serve()

  // TODO: this delay is a bit hacky but regardless the fetch will be retried
  // several times with an increasing delay
  await delay(2000)

  const url = `http://localhost:${port}/openapi.json`
  const { body: spec } = await module.exports.fetchOpenAPI(url, { json: true })
  console.log('openapi', spec)

  await killProcessTree(child.pid)
  child.cancel()
  await child

  return spec
}

module.exports.fetchOpenAPI = async (url, opts = {}) => {
  return pRetry(() => got(url, opts), {
    retries: 6,
    factor: 1.8,
    maxTimeout: 5000
  })
}
