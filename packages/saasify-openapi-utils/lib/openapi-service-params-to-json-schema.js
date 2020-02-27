'use strict'

const cloneDeep = require('clone-deep')
const createError = require('http-errors')
const refParser = require('json-schema-ref-parser')

const serviceToPathOperation = require('./service-to-path-operation')

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
  const { name, path, httpMethod } = service

  const op = serviceToPathOperation(service, openapi)
  let schema

  if (!op) {
    throw createError(
      400,
      `Error service [${name}] unable to find matching OpenAPI PathOperation for path "${path}" and HTTP method "${httpMethod}"`
    )
  }

  // TODO: handle other http methods
  // TODO: this will not be robust against arbitrary OpenAPI specs

  try {
    if (
      op.requestBody &&
      op.requestBody.content &&
      op.requestBody.content['application/json'] &&
      op.requestBody.content['application/json'].schema
    ) {
      schema = cloneDeep(op.requestBody.content['application/json'].schema)
      schema.type = schema.type || 'object'
      schema.properties = schema.properties || {}
      schema.required = schema.required || []
    } else {
      schema = {
        additionalProperties: false,
        type: 'object',
        properties: {},
        required: []
      }
    }

    schema.components = openapi.components

    // TODO: this is generating invalid JSON Schemas...
    // we really need to move away from JSON Schema entirely

    for (const param of op.parameters) {
      schema.properties[param.name] = {
        name: param.name,
        ...param.schema
      }

      if (param.required) {
        schema.required.push(param.name)
      }
    }

    // ensure schema is clean and fully dereferenced
    schema = await refParser.dereference(schema)
  } catch (err) {
    console.error(err)
    console.log(JSON.stringify(op, null, 2))

    throw createError(
      400,
      `Error converting service OpenAPI "${path}" to JSON Schema`
    )
  }

  delete schema.$ref
  delete schema.components

  // console.log(JSON.stringify(schema, null, 2))

  return schema
}
