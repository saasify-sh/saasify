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
    config.openapi = await resolveOpenApiSchema(config.openapi, config.root)
  } catch (err) {
    throw new Error(`Error resolving OpenAPI spec: ${err.message}`)
  }

  const serverUrl = process.env.OPENAPI_SERVER_URL || config.serverUrl
  if (serverUrl) {
    config.openapi.servers = [{ url: serverUrl }]
  }

  const openapi = await parseOpenAPI(config.openapi, { strict: true })
  const services = await convertOpenAPIToServices(openapi, config)

  return {
    ...config,
    openapi,
    services
  }
}
