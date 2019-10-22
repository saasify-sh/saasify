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

  return schema
}

async function prepareSchema (schema) {
  const deref = await jsonSchemaRefParser.dereference(schema)
  // all $refs have been replaced directly, so remove any indirect definitions
  delete deref.definitions
  return pruneCustomKeywords(deref)
}

module.exports.serviceToPaths = async function serviceToPaths (service) {
  const {
    route,
    definition
  } = service

  const params = await prepareSchema(definition.params.schema)
  const { schema } = definition.returns
  const { type, additionalProperties, properties, ...rest } = schema
  const returnsJsonSchema = {
    ...rest,
    ...properties.result
  }
  const returns = await prepareSchema(returnsJsonSchema)

  const paramsSchema = jsonSchemaToOpenAPI(params)
  const responseSchema = jsonSchemaToOpenAPI(returns)

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
