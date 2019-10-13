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

  await delay(1000)
  const url = `http://localhost:${port}/openapi.json`
  const { body: spec } = await got(url, { json: true })
  await killProcessTree(child.pid)

  console.log(spec)
  console.log(JSON.stringify(spec, null, 2))

  child.cancel()
  await child

  return spec
}
