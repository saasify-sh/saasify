'use strict'

const tsAdaptor = require('./typescript')
const { generateSrcFromCli } = require('saasify-utils')
const pMap = require('p-map')
const fs = require('fs-extra')
const tempy = require('tempy')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

module.exports = async (opts) => {
  const { program, serveProjectLocal, ...rest } = opts

  const config = {
    ...opts.config,
    // Create a temporary directory so we don't interfere with local files
    root: tempy.directory()
  }

  // NB Using root readme doesn't really work. perhaps api.md?
  fs.copySync('readme.md', path.join(config.root, 'readme.md'))

  process.chdir(config.root)

  const npmConfig = await module.exports.installDependencies(config)

  // TODO: Just as with the TS adaptor, concurrency within a single process
  // doesn't work here because TS compiler is CPU-bound. Explore workarounds
  // to speed up multi-service projects.
  const services = await pMap(
    config.services,
    async (service, i) => {
      const fileName = `${service.name || `src_${i}`}.ts`
      await generateSrcFromCli(path.join(process.cwd(), fileName), service)

      return tsAdaptor.generateDefinition(
        program,
        {
          ...service,
          src: fileName
        },
        config,
        rest
      )
    },
    {
      concurrency: 1
    }
  )

  return {
    ...config,
    npmConfig,
    services
  }
}

module.exports.installDependencies = async (config) => {
  const npmConfig = {
    dependencies: {
      'fts-core': '^1.1.0',
      'saasify-utils': '^1.12.0'
    },
    devDependencies: {
      '@types/node': '^12.6.9'
    }
  }

  // Shim necessary packages
  if (config.package) {
    const [name, version] = config.package.split('@')

    npmConfig.dependencies = {
      ...npmConfig.dependencies,
      [name]: version
    }
  }

  await fs.writeJson('package.json', npmConfig, { spaces: 2 })

  console.error(`installing dependencies`)

  await exec('npm i')

  return npmConfig
}
