'use strict'

const Ajv = require('ajv')
const fs = require('fs-extra')
const isDirectory = require('is-directory')
const get = require('lodash.get')
const path = require('path')
const parseJson = require('parse-json')
const semver = require('semver')
const { validators } = require('saasify-utils')
const yaml = require('js-yaml')

const configSchema = require('./schemas/config.schema')

const ajv = new Ajv({ useDefaults: true })
const validateConfig = ajv.compile(configSchema)

const deprecatedConfigPaths = [
  {
    path: 'noAuthRateLimit',
    message: '"noAuthRateLimit" is deprecated in favor of "pricingPlans"'
  },
  {
    path: 'authRateLimit',
    message: '"authRateLimit" is deprecated in favor of "pricingPlans"'
  },
  {
    path: 'amountPerBase',
    message: '"amountPerBase" is deprecated in favor of "pricingPlans"'
  },
  {
    path: 'amountPerRequests',
    message: '"amountPerRequests" is deprecated in favor of "pricingPlans"'
  },
  {
    path: 'amountPerCompute',
    message:
      '"amountPerCompute" is deprecated in favor of "pricingPlans" (per-compute pricing is no longer supported)'
  },
  {
    path: 'amountPerBandwidth',
    message:
      '"amountPerBandwidth" is deprecated in favor of "pricingPlans" (per-bandwidth pricing is no longer supported)'
  }
]

module.exports = async (program) => {
  const base = path.resolve(program.config || '')

  if (!fs.pathExistsSync(base)) {
    throw new Error(`Unable to find config file "${program.config}"`)
  }

  const jsonConfigFilePath = isDirectory.sync(base)
    ? path.join(base, 'saasify.json')
    : base

  const yamlConfigFilePath = isDirectory.sync(base)
    ? path.join(base, 'saasify.yml')
    : base

  let configFilePath
  let fileType

  if (fs.pathExistsSync(jsonConfigFilePath)) {
    configFilePath = jsonConfigFilePath
    fileType = 'json'
  } else if (fs.pathExistsSync(yamlConfigFilePath)) {
    configFilePath = yamlConfigFilePath
    fileType = 'yaml'
  } else {
    throw new Error(`Unable to find config file "${jsonConfigFilePath}"`)
  }

  const configLabel = path.relative(process.cwd(), configFilePath)
  console.error(`parsing config ${configLabel}`)

  const configData = fs.readFileSync(configFilePath, 'utf8')
  const config =
    fileType === 'json'
      ? parseJson(configData, configLabel)
      : yaml.safeLoad(configData)
  const root = path.dirname(configFilePath)

  for (const deprecatedConfigPath of deprecatedConfigPaths) {
    if (get(config, deprecatedConfigPath.path) !== undefined) {
      console.warn(`config warning: ${deprecatedConfigPath.message}`)
    }
  }

  validateConfig(config)

  if (validateConfig.errors) {
    throw new Error(`Invalid config: ${ajv.errorsText(validateConfig.errors)}`)
  }

  config.root = root

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
    if (config.openapi) {
      config.services = []
    } else {
      throw new Error('Invalid config, must contain at least one service')
    }
  }

  return config
}
