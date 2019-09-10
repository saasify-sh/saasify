'use strict'

const decompress = require('decompress')
const decompressUnzip = require('decompress-unzip')
const fs = require('fs-extra')
const path = require('path')
const tempy = require('tempy')

const nowConfigName = 'now.json'
const npmConfigName = 'package.json'
const tsConfigName = 'tsconfig.json'
const jsonConfig = { spaces: 2 }

module.exports = async (deployment, data, opts = { }) => {
  const {
    tempDir = tempy.directory(),
    config = { }
  } = opts

  await decompress(data, tempDir, {
    plugins: [
      decompressUnzip()
    ]
  })

  const builds = []
  const routes = []

  for (const service of deployment.services) {
    const srcPath = path.relative(tempDir, path.resolve(tempDir, service.src.replace('.ts', '')))

    const definitionData = JSON.stringify(service.definition, null, 2)
    const serviceName = service.name

    const handlerFileName = `__handler__${serviceName}`
    const handlerFileNameExt = `${handlerFileName}.ts`
    const handlerPath = path.join(tempDir, handlerFileNameExt)
    const handler = `
import * as ftsHttp from 'fts-http'
import * as handler from './${srcPath}'
const definition = ${definitionData}
export default ftsHttp.createHttpHandler(definition, handler)
`

    fs.writeFileSync(handlerPath, handler, 'utf8')

    builds.push({
      src: handlerFileNameExt,
      use: '@now/node@0.12.8',
      config: {
        'maxLambdaSize': '40mb',
        ...config
      }
    })

    routes.push({
      src: `/${serviceName}`,
      dest: handlerFileNameExt
    })

    if (deployment.services.length === 1) {
      routes.push({
        src: '/',
        dest: handlerFileNameExt
      })
    }
  }

  const nowConfigPath = path.join(tempDir, nowConfigName)
  const npmConfigPath = path.join(tempDir, npmConfigName)
  const tsConfigPath = path.join(tempDir, tsConfigName)

  if (fs.existsSync(nowConfigPath)) {
    console.log(`warn: overriding "${nowConfigName}"`)
  }

  await fs.writeJson(nowConfigPath, {
    version: 2,
    name: deployment.project,
    builds,
    routes
  }, jsonConfig)

  if (!fs.existsSync(tsConfigPath)) {
    await fs.writeJson(tsConfigPath, {
      compilerOptions: {
        target: 'es2015',
        moduleResolution: 'node'
      }
    }, jsonConfig)
  }

  if (!fs.existsSync(npmConfigPath)) {
    await fs.writeJson(npmConfigPath, { }, jsonConfig)
  }

  const npmConfig = await fs.readJson(npmConfigPath)
  const dependencies = npmConfig.dependencies || {}
  const devDependencies = npmConfig.devDependencies || {}

  // TODO: remove 'fts' as a dependency
  dependencies.fts = '^1'
  dependencies['fts-http'] = '^1.1.6'
  devDependencies['@types/node'] = 'latest'
  npmConfig.dependencies = dependencies
  npmConfig.devDependencies = devDependencies
  await fs.writeJson(npmConfigPath, npmConfig, jsonConfig)

  return tempDir
}
