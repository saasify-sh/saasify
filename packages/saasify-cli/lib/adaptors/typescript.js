'use strict'

const fs = require('fs-extra')
const fts = require('fts')
const path = require('path')
const pick = require('lodash.pick')
const pMap = require('p-map')
const { validators } = require('saasify-utils')

module.exports = async (opts) => {
  const {
    program,
    config,
    ...rest
  } = opts

  const services = await pMap(config.services, async (service) => {
    return module.exports.generateDefinition(program, service, config, rest)
  }, {
    concurrency: 1
  })

  const pkgInfo = await module.exports.getPackageInfo(config)

  return {
    ...pkgInfo,
    ...config,
    services
  }
}

module.exports.getPackageInfo = async (config) => {
  const packageJsonPath = path.join(config.root, 'package.json')

  if (fs.pathExistsSync(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath)

    return pick(pkg, [
      'description',
      'keywords',
      'repository',
      'license',
      'version'
    ])
  }

  return { }
}

module.exports.generateDefinition = async (program, service, config, opts) => {
  const src = path.resolve(config.root, service.src)
  const srcRelative = path.relative(process.cwd(), src)
  console.log(`parsing service ${srcRelative}`)

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
