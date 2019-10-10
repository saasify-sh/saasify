'use strict'

const axios = require('axios')
const delay = require('delay')
const fs = require('fs-extra')
const findFreePort = require('find-free-port')
const fts = require('fts')
const globby = require('globby')
const path = require('path')
const pick = require('lodash.pick')
const pMap = require('p-map')
const pRetry = require('p-retry')
const { validators } = require('saasify-utils')

const getExtension = require('./get-extension')
const parseConfig = require('./parse-config')
const serveProjectLocal = require('./serve-project-local')

module.exports = async (program, opts = { }) => {
  const config = parseConfig(program)

  const services = await pMap(config.services, async (service) => {
    return module.exports.generateDefinition(program, service, config, opts)
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

module.exports.generateDefinition = async (program, service, config, opts) => {
  const src = path.resolve(config.root, service.src)
  const srcRelative = path.relative(process.cwd(), src)
  const ext = getExtension(service.src)
  console.log(`parsing service ${srcRelative}`)

  let definition

  if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
    definition = await fts.generateDefinition(src, opts)
  } else if (ext === 'py') {
    const [port] = await findFreePort(8761)

    const serve = await serveProjectLocal(program, config, {
      ...opts,
      listen: port,
      shell: true
    })

    const serveP = serve()

    await delay(5000)
    const spec = await pRetry(async () => {
      const url = `http://localhost:${port}/openapi.json`
      return axios.get(url).then((res) => res.data)
    }, {
      retries: 3
    })

    console.log(spec)
    serveP.cancel()
    await serveP
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
