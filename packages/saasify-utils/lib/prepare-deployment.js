'use strict'

const decompress = require('decompress')
const decompressUnzip = require('decompress-unzip')
const fs = require('fs-extra')
const path = require('path')
const tempy = require('tempy')

const getExtension = require('./get-extension')

const nowConfigName = 'now.json'
const npmConfigName = 'package.json'
const tsConfigName = 'tsconfig.json'
const jsonConfig = { spaces: 2 }

module.exports = async (deployment, data, opts = {}) => {
  const {
    tempDir = tempy.directory(),
    config = {},
    debug = false,
    provider
  } = opts

  await decompress(data, tempDir, {
    plugins: [decompressUnzip()]
  })

  if (provider === 'external') {
    return tempDir
  }

  const builds = []
  const routes = []
  const serviceNames = new Set()
  let language

  for (const service of deployment.services) {
    const ext = (getExtension(service.src) || '').toLowerCase()
    let { headers, immutable } = service

    if (immutable) {
      headers = {
        'cache-control':
          'public, immutable, s-maxage=31536000, max-age=31536000, stale-while-revalidate',
        ...headers
      }
    } else if (!headers || !headers['cache-control']) {
      // ZEIT now sets default cache-control headers of `public, max-age=0, must-revalidate`
      // We want to override this default with something a little more aggressive.
      headers = {
        ...headers,
        'cache-control':
          'public, s-maxage=3600, max-age=3600, stale-while-revalidate'
      }
    }

    if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
      if (language && language !== 'ts') {
        const err = new Error(
          'Mixing service languages is not currently supported'
        )
        err.statusCode = 400
        throw err
      }

      language = 'ts'

      const srcPath = path.relative(
        tempDir,
        path.resolve(tempDir, service.src.replace(`.${ext}`, ''))
      )

      const definitionData = JSON.stringify(service.definition, null, 2)
      const serviceName = service.name
      const servicePath = service.path || `/${serviceName}`

      // TODO: this validation logic doesn't really belong here
      if (serviceNames.has(serviceName)) {
        const err = new Error(`Duplicate service name "${serviceName}"`)
        err.statusCode = 400
        throw err
      } else {
        serviceNames.add(serviceName)
      }

      const handlerFileName = `__handler__${serviceName}`
      const handlerFileNameExt = `${handlerFileName}.ts`
      const handlerPath = path.join(tempDir, handlerFileNameExt)
      const handler = `
  import * as ftsHttp from 'fts-http'
  import * as handler from './${srcPath}'
  const definition = ${definitionData}
  export default ftsHttp.createHttpHandler(definition, handler, { debug: ${!!debug} })
  `

      fs.writeFileSync(handlerPath, handler, 'utf8')

      builds.push({
        src: handlerFileNameExt,
        use: '@now/node@1.3.4',
        config: {
          maxLambdaSize: '50mb',
          ...(service.config || {}),
          ...config
        }
      })

      routes.push({
        src: servicePath,
        dest: handlerFileNameExt,
        headers
      })

      if (deployment.services.length === 1) {
        routes.push({
          src: '/',
          dest: handlerFileNameExt,
          headers
        })
      }
    } else if (ext === 'py') {
      if (language && language !== 'py') {
        const err = new Error(
          'Mixing service languages is not currently supported'
        )
        err.statusCode = 400
        throw err
      }

      language = 'py'

      builds.push({
        src: service.src,
        use: '@now/python@1.0.0',
        config: {
          maxLambdaSize: '50mb',
          ...(service.config || {}),
          ...config
        }
      })

      routes.push({
        src: '.*',
        dest: service.src,
        headers
      })

      // TODO: restrict python to a single entry service
      break
    } else {
      const err = new Error(`Unsupported service type "${service.src}"`)
      err.statusCode = 400
      throw err
    }
  }

  const nowConfigPath = path.join(tempDir, nowConfigName)

  if (fs.existsSync(nowConfigPath)) {
    console.log(`warn: overriding "${nowConfigName}"`)
  }

  const prefix = deployment.team || deployment.user
  await fs.writeJson(
    nowConfigPath,
    {
      version: 2,
      name: deployment.project,
      build: {
        env: transformEnv(
          prefix,
          (deployment.build && deployment.build.env) || {}
        )
      },
      env: transformEnv(prefix, deployment.env || {}),
      builds,
      routes
    },
    jsonConfig
  )

  if (language === 'ts') {
    const tsConfigPath = path.join(tempDir, tsConfigName)
    const npmConfigPath = path.join(tempDir, npmConfigName)

    if (!fs.existsSync(tsConfigPath)) {
      await fs.writeJson(
        tsConfigPath,
        {
          compilerOptions: {
            target: 'es2015',
            moduleResolution: 'node'
          }
        },
        jsonConfig
      )
    }

    if (!fs.existsSync(npmConfigPath)) {
      await fs.writeJson(npmConfigPath, {}, jsonConfig)
    }

    const npmConfig = await fs.readJson(npmConfigPath)
    const dependencies = npmConfig.dependencies || {}
    const devDependencies = npmConfig.devDependencies || {}

    // TODO: remove 'fts' as a dependency
    dependencies.fts = '^1'
    dependencies['fts-http'] = '^1.3.10'

    if (!devDependencies['@types/node']) {
      devDependencies['@types/node'] = 'latest'
    }

    npmConfig.dependencies = dependencies
    npmConfig.devDependencies = devDependencies

    // ensure we set a default engines to the latest version of Node.js that ZEIT supports
    if (!npmConfig.engines || !npmConfig.engines.node) {
      npmConfig.engines = {
        ...npmConfig.engines,
        node: '>=12'
      }
    }

    await fs.writeJson(npmConfigPath, npmConfig, jsonConfig)
  }

  return tempDir
}

const transformEnv = function(userId, env = {}) {
  return Object.entries(env).reduce((acc, [key, value]) => {
    if (value.startsWith('@')) {
      value = `@${userId}-${value.substr(1)}`
    }

    acc[key] = value
    return acc
  }, {})
}
