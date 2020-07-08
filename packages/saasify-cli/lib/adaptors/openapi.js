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

  const backendUrl = process.env.SAASIFY_BACKEND_URL || config.backendUrl

  if (backendUrl) {
    config.backendUrl = backendUrl
    config.openapi.servers = [{ url: backendUrl }]
  }

  const backendDevUrl =
    process.env.SAASIFY_BACKEND_DEV_URL || config.backendDevUrl
  if (backendUrl) {
    config.backendDevUrl = backendDevUrl
  }

  const openapi = await parseOpenAPI(config.openapi, { strict: true })
  const services = await convertOpenAPIToServices(openapi, config)

  return {
    ...config,
    openapi,
    services
  }
}
