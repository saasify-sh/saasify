'use strict'

const cloneDeep = require('clone-deep')
const refParser = require('json-schema-ref-parser')

const serviceToPathItem = require('./service-to-path-item')

// TODO: use https://github.com/openapi-contrib/openapi-schema-to-json-schema

module.exports = async (ctx, { service, openapi }) => {
  const { name } = service

  const pathItem = serviceToPathItem(service, openapi)
  let schema

  ctx.assert(
    pathItem,
    400,
    `Error service [${name}] unable to find matching OpenAPI PathItem for path "${service.path}"`
  )

  if (pathItem.post) {
    // Convert OpenAPI POST PathItem to JSON Schema
    const op = pathItem.post

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
    ctx.assert(
      false,
      400,
      `Error service [${name}] matches invalid OpenAPI path item "${service.path}" which doesn't support POST or GET`
    )
  }

  ctx.assert(
    schema,
    400,
    `Error service [${name}] matches invalid OpenAPI path item "${service.path}" - JSON schema conversion failed`
  )

  // ensure schema is clean and fully dereferenced
  schema = await refParser.dereference(schema)
  delete schema.$ref
  delete schema.components

  console.log(JSON.stringify(schema, null, 2))

  return schema
}
