'use strict'

const delay = require('delay')
const findFreePort = require('find-free-port')
const got = require('got')
const path = require('path')
const {
  parseOpenAPI,
  convertOpenAPIToServices
} = require('saasify-utils')

const killProcessTree = require('../kill-process-tree')
const serveProjectLocal = require('../serve-project-local')

module.exports = async (opts) => {
  const {
    program,
    config,
    serveProjectLocal,
    ...rest
  } = opts

  // TODO: relax restriction on only having one source service
  if (config.services.length > 1) {
    throw new Error('Python only supports a single source service')
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

  for (const service of services) {
    service.src = config.services[0].src
  }

  return {
    ...config,
    openapi,
    services
  }
}

// TODO: find a less hacky approach for extracting the openapi schema
module.exports.extractOpenAPI = async (opts) => {
  const {
    program,
    config,
    service,
    ...rest
  } = opts

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

  // TODO: is this delay necessary to wait before now dev is listening on the port?
  await delay(5000)

  const url = `http://localhost:${port}/openapi.json`
  const { body: spec } = await got(url, { json: true, retry: { limit: 5 } })
  console.log('openapi', spec)

  await killProcessTree(child.pid)
  child.cancel()
  await child

  return spec
}
