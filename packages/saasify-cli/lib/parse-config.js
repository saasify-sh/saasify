'use strict'

const Ajv = require('ajv')
const fs = require('fs-extra')
const isDirectory = require('is-directory')
const path = require('path')
const parseJson = require('parse-json')
const semver = require('semver')
const { validators } = require('saasify-utils')

const configSchema = require('./schemas/config.schema')

const ajv = new Ajv({ useDefaults: true })
const validateConfig = ajv.compile(configSchema)

module.exports = (program) => {
  const base = path.resolve(program.config || '')

  if (!fs.pathExistsSync(base)) {
    throw new Error(`Unable to find config file "${program.config}"`)
  }

  const configFilePath = isDirectory.sync(base)
    ? path.join(base, 'saasify.json')
    : base

  if (!fs.pathExistsSync(configFilePath)) {
    throw new Error(`Unable to find config file "${configFilePath}"`)
  }

  const configLabel = path.relative(process.cwd(), configFilePath)
  console.error(`parsing config ${configLabel}`)
  const configData = fs.readFileSync(configFilePath, 'utf8')
  const config = parseJson(configData, configLabel)
  validateConfig(config)

  if (validateConfig.errors) {
    throw new Error(`Invalid config: ${ajv.errorsText(validateConfig.errors)}`)
  }

  config.root = path.dirname(configFilePath)

  // ensure the config has a valid project name
  if (program.project) {
    config.name = program.project
  } else if (!config.name) {
    config.name = path.basename(config.root)
  }

  if (!config.name) {
    throw new Error('Missing config name')
  }

  if (!validators.projectName(config.name)) {
    throw new Error(
      `Invalid config name [${config.name}] (regex ${validators.projectNameRe})`
    )
  }

  if (config.saasifyVersion !== 1) {
    throw new Error(`Invalid config saasifyVersion "${config.saasifyVersion}"`)
  }

  if (!semver.valid(config.version)) {
    throw new Error(`Invalid config semver version "${config.version}"`)
  }

  if (!config.services || !config.services.length) {
    throw new Error('Invalid config, must contain at least one service')
  }

  for (const service of config.services) {
    if (service.name && !validators.service(service.name)) {
      throw new Error(
        `Invalid config service "name" [${service.name}] (must be a valid JavaScript identifier regex ${validators.serviceRe})`
      )
    }
  }

  return config
}
