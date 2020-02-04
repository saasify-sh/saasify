'use strict'

const {
  parseOpenAPI,
  convertOpenAPIToServices
} = require('saasify-openapi-utils')

const resolveOpenApiSchema = require('../resolve-openapi-schema')

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

  const openapi = await parseOpenAPI(config.openapi)
  const services = await convertOpenAPIToServices(openapi, config)

  return {
    ...config,
    openapi,
    services
  }
}
