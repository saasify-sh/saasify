'use strict'

const cloneDeep = require('clone-deep')
const createError = require('http-errors')
const refParser = require('json-schema-ref-parser')

const serviceToPathItem = require('./service-to-path-item')

// TODO: use https://github.com/openapi-contrib/openapi-schema-to-json-schema

/**
 * Converts an OpenAPI-based Service's input parameters into a corresponding
 * JSON Schema.
 *
 * @param {object} service - Service to convert.
 * @param {object} openapi - OpenAPI spec for the parent deployment.
 *
 * @return {Promise}
 */
module.exports = async (service, openapi) => {
  const { name } = service

  const pathItem = serviceToPathItem(service, openapi)
  let schema

  if (!pathItem) {
    throw createError(
      400,
      `Error service [${name}] unable to find matching OpenAPI PathItem for path "${service.path}"`
    )
  }

  // TODO: handle other http methods

  if (pathItem.post || pathItem.put) {
    // Convert OpenAPI POST PathItem to JSON Schema
    const op = pathItem.post || pathItem.put

    // TODO: this will not be robust against arbitrary OpenAPI specs

    schema = cloneDeep(op.requestBody.content['application/json'].schema)
    schema.components = openapi.components

    // we're ignoring the possibility of op.parameters because op.requestBody
    // should always take precedence
  } else if (pathItem.get) {
    // Convert OpenAPI GET PathItem to JSON Schema
    const op = pathItem.get

    schema = {
      additionalProperties: false,
      type: 'object',
      properties: {},
      required: [],
      components: openapi.components
    }

    for (const param of op.parameters) {
      schema.properties[param.name] = {
        name: param.name,
        ...param.schema
      }

      if (param.required) {
        schema.required.push(param.name)
      }
    }
  } else {
    throw createError(
      400,
      `Error service [${name}] matches invalid OpenAPI path item "${service.path}" which doesn't support POST or GET`
    )
  }

  if (!schema) {
    throw createError(
      400,
      `Error service [${name}] matches invalid OpenAPI path item "${service.path}" - JSON schema conversion failed`
    )
  }

  // ensure schema is clean and fully dereferenced
  schema = await refParser.dereference(schema)
  delete schema.$ref
  delete schema.components

  // console.log(JSON.stringify(schema, null, 2))

  return schema
}
