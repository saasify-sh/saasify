'use strict'

const fts = require('fts')
const path = require('path')
const pMap = require('p-map')
const { validators } = require('fin-utils')

const parseConfig = require('./parse-config')

module.exports = async (program, opts = { }) => {
  const config = parseConfig(program)

  const services = await pMap(config.services, async (service) => {
    return module.exports.generateDefinition(service, config, opts)
  }, {
    concurrency: 1
  })

  return {
    ...config,
    services
  }
}

module.exports.generateDefinition = async (service, config, opts) => {
  const src = path.resolve(config.root, service.src)
  console.log(`parsing service ${path.relative(process.cwd(), src)}`)
  const definition = await fts.generateDefinition(src, opts)

  if (!service.name) {
    service.name = definition.title

    if (!validators.service(service.name)) {
      throw new Error(`Invalid service name [${service.name}] (must be a valid JavaScript function identifier ${validators.serviceRe})`)
    }
  }

  return {
    ...service,
    definition
  }
}
