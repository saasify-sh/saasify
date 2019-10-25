'use strict'

const jsonSchemaToOpenAPI = require('json-schema-to-openapi-schema')
const jsonSchemaRefParser = require('json-schema-ref-parser')
const pReduce = require('p-reduce')

module.exports = async function saasifyToOpenAPI (deployment, opts = { }) {
  const paths = await pReduce(deployment.services, async (paths, service) => ({
    ...paths,
    ...(await module.exports.serviceToPaths(service))
  }), { })

  const version = deployment.version
    ? `v${deployment.version}`
    : undefined

  return {
    openapi: '3.0.2',
    info: {
      title: deployment.project.name,
      version
    },
    paths
  }
}

function pruneCustomKeywords (schema) {
  if (Array.isArray(schema)) {
    schema.forEach(pruneCustomKeywords)
  } else if (typeof schema === 'object') {
    // TODO: this is a bit hacky and could delete valid params
    // we need a more structured traversal
    delete schema.coerceTo
    delete schema.coerceFrom
    Object.values(schema).forEach(pruneCustomKeywords)
  }
}

function pruneTypes (schema) {
  if (Array.isArray(schema)) {
    schema.forEach(pruneTypes)
  } else if (typeof schema === 'object') {
    for (const [key, value] of Object.entries(schema)) {
      if (key === 'type') {
        if (Array.isArray(value)) {
          // OpenAPI doesn't support certain ambiguous oneOf types like:
          // - number | boolean
          // - number | string
          // - string | boolean
          const types = {
            number: 0,
            string: 0,
            boolean: 0
          }

          for (const v of value) {
            types[v]++
          }

          if (types.number + types.string + types.boolean >= 2) {
            if (types.string) {
              schema[key] = 'string'
            } else if (types.number) {
              schema[key] = 'number'
            } else {
              schema[key] = 'boolean'
            }
          }
        }

        if (schema.items && Array.isArray(schema.items)) {
          // TODO: figure out a better fallback type for these cases
          // a variable-length array is commonly used for numbers but could also be used
          // for strings, booleans, etc.
          schema.items = { type: 'number' }
          delete schema.additionalItems
        }
      }

      pruneTypes(value)
    }
  }
}

async function prepareSchema (schema) {
  const deref = await jsonSchemaRefParser.dereference(schema)
  // all $refs have been replaced directly, so remove any indirect definitions
  delete deref.definitions

  // prune custom FTS keywords
  pruneCustomKeywords(deref)

  // prune incompatible types
  pruneTypes(deref)

  return deref
}

module.exports.serviceToPaths = async function serviceToPaths (service) {
  const {
    route,
    definition
  } = service

  const params = await prepareSchema(definition.params.schema)
  const { http, schema } = definition.returns
  const { type, additionalProperties, properties, ...rest } = schema
  const paramsSchema = jsonSchemaToOpenAPI(params)
  let responseSchema

  if (http) {
    responseSchema = {
      description: 'Raw HTTP response.',
      type: 'object',
      properties: {
        statusCode: {
          type: 'number'
        },
        headers: {
          type: 'object',
          additionalProperties: {
            type: 'string'
          }
        },
        body: {
          description: 'Raw response body which can be interpreted using the standard `Content-Type` header.',
          type: 'array',
          items: {
            type: 'number'
          }
        }
      },
      additionalProperties: false
    }
  } else {
    const returnsJsonSchema = {
      ...rest,
      ...properties.result
    }
    const returns = await prepareSchema(returnsJsonSchema)
    responseSchema = jsonSchemaToOpenAPI(returns)
  }

  const responses = {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: responseSchema
        }
      }
    }
  }

  const post = {
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: paramsSchema
        }
      }
    },
    responses
  }

  const parameters = []

  for (const [name, schema] of Object.entries(paramsSchema.properties)) {
    const param = {
      name,
      schema,
      in: 'query'
    }

    if (schema.description) {
      param.description = schema.description
    }

    if (schema.$ref) {
      param.schema = {
        ...schema,
        definitions: paramsSchema.definitions
      }
    }

    if (paramsSchema.required && paramsSchema.required.indexOf(name) >= 0) {
      param.required = true
    }

    parameters.push(param)
  }

  const get = {
    parameters,
    responses
  }

  if (definition.description) {
    post.description = definition.description
    get.description = definition.description
  }

  const result = { }

  if (service.GET !== false) {
    result.get = get
  }

  if (service.POST !== false) {
    result.post = post
  }

  return {
    [route]: result
  }
}
