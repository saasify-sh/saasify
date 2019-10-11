'use strict'

const validators = require('./validators')

module.exports = async (api) => {
  for (const path of Object.keys(api.paths)) {
    const pathItem = api.paths[path]

    // TODO: convert pathItem to service with FTS definition?
    // OR: convert FTS definitions to OpenAPI specs for TS sources?
  }

  return []
}
