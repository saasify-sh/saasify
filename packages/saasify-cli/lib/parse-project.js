'use strict'

const fs = require('fs-extra')
const fts = require('fts')
const globby = require('globby')
const path = require('path')
const pick = require('lodash.pick')
const pMap = require('p-map')
const { validators } = require('saasify-utils')

const getExtension = require('./get-extension')
const parseConfig = require('./parse-config')

module.exports = async (program, opts = { }) => {
  const config = parseConfig(program)

  const services = await pMap(config.services, async (service) => {
    return module.exports.generateDefinition(service, config, opts)
  }, {
    concurrency: 1
  })

  const readme = await module.exports.getReadme(config)
  const pkgInfo = await module.exports.getPackageInfo(config)

  return {
    ...pkgInfo,
    ...config,
    readme,
    services
  }
}

module.exports.getReadme = async (config) => {
  const readmeFiles = await globby('readme.md', {
    cwd: config.root,
    gitignore: true,
    nocase: true
  })

  if (readmeFiles.length) {
    return fs.readFile(readmeFiles[0], 'utf8')
  } else {
    console.warn('Unable to find readme')
    return ''
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

module.exports.generateDefinition = async (service, config, opts) => {
  const src = path.resolve(config.root, service.src)
  const srcRelative = path.relative(process.cwd(), src)
  console.log(service.src, getExtension(service.src))
  const ext = getExtension(service.src).toLowerCase()
  console.log(`parsing service ${srcRelative}`)

  let definition

  if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
    definition = await fts.generateDefinition(src, opts)
  } else if (ext === 'py') {
    // TODO
  } else {
    throw new Error(`Invalid service type "${ext}" [${src}]`)
  }

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
