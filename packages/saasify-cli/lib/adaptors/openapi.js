'use strict'

const Ajv = require('ajv')
const {
  parseOpenAPI,
  convertOpenAPIToServices
} = require('saasify-openapi-utils')

const resolveOpenApiSchema = require('../resolve-openapi-schema')
const openapiSchema = require('./schemas/openapi.schema')

const ajv = new Ajv({ useDefaults: true })
const validateOpenApi = ajv.compile(openapiSchema)

module.exports = async (opts) => {
  const { config } = opts

  if (!config.openapi) {
    throw new Error(`Error resolving OpenAPI spec`)
  }

  try {
    config.openapi = await resolveOpenApiSchema(config.openapi)
  } catch (err) {
    throw new Error(`Error resolving OpenAPI spec: ${err.message}`)
  }

  validateOpenApi(config.openapi)

  if (validateOpenApi.errors) {
    throw new Error(
      `Invalid OpenAPI spec: ${ajv.errorsText(validateOpenApi.errors)}`
    )
  }

  const openapi = await parseOpenAPI(config.openapi)
  const services = await convertOpenAPIToServices(openapi, config)

  return {
    ...config,
    openapi,
    services
  }
}
