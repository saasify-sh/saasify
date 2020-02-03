'use strict'

const Ajv = require('ajv')

const openapiSchema = require('./schemas/openapi')

const ajv = new Ajv()
const validateOpenAPI = ajv.compile(openapiSchema)

module.exports = async (spec) => {
  validateOpenAPI(spec)

  if (validateOpenAPI.errors) {
    throw new Error(
      `Invalid OpenAPI spec: ${ajv.errorsText(validateOpenAPI.errors)}`
    )
  }
}
