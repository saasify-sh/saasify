'use strict'

const axios = require('axios')
const delay = require('delay')
const findFreePort = require('find-free-port')
const path = require('path')
const pRetry = require('p-retry')
const {
  parseOpenAPI,
  convertOpenAPIToServices
} = require('saasify-utils')

const serveProjectLocal = require('../serve-project-local')

module.exports = async (opts) => {
  const {
    program,
    config,
    ...rest
  } = opts

  // TODO: relax restriction on only having one source service
  if (config.services.length > 1) {
    throw new Error('Python only supports a single source service')
  }

  const openapi = await module.exports.extractOpenAPI({
    program,
    config,
    service: config.services[0],
    ...rest
  })

  console.log('parsing')
  const openapiResolved = await parseOpenAPI(openapi)
  console.log('resolved', openapiResolved)
  const services = await convertOpenAPIToServices(openapiResolved)
  console.log('services', services)

  // TODO: what to do with openapi spec?
  return {
    ...config,
    openapi,
    services: config.services
  }
}

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
    listen: port,
    shell: true
  })

  const serveP = serve()

  // TODO: find a less hacky workaround
  await delay(5000)
  const spec = await pRetry(async () => {
    const url = `http://localhost:${port}/openapi.json`
    return axios.get(url).then((res) => res.data)
  }, {
    retries: 3
  })

  console.log(spec)
  serveP.kill('SIGTERM', { forceKillAfterTimeout: 2000 })

  return spec
}
