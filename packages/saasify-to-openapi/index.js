'use strict'

const jsonSchemaToOpenAPI = require('json-schema-to-openapi-schema')
const jsonSchemaRefParser = require('json-schema-ref-parser')
const pReduce = require('p-reduce')
const codegen = require('saasify-codegen')

module.exports = async function saasifyToOpenAPI(deployment, opts = {}) {
  const components = { schemas: {} }
  const paths = await pReduce(
    deployment.services,
    async (paths, service) => ({
      ...paths,
      ...(await module.exports.serviceToPaths(service, components))
    }),
    {}
  )

  const version = deployment.version ? `v${deployment.version}` : undefined

  // all other saasify-specific metadata gets added to the this base openapi
  // spec later via annotate-openapi
  return {
    openapi: '3.0.2',
    info: {
      title: deployment.project.name,
      version
    },
    paths,
    components
  }
}

function pruneCustomKeywords(schema) {
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

function pruneTypes(schema) {
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

function rewriteRefs(schema, opts) {
  if (Array.isArray(schema)) {
    schema.forEach((value) => rewriteRefs(value, opts))
  } else if (typeof schema === 'object') {
    for (const [key, value] of Object.entries(schema)) {
      if (key === '$ref' && typeof value === 'string') {
        const { fromPrefix, toPrefix } = opts

        if (value.startsWith(fromPrefix)) {
          schema[key] = toPrefix + value.substr(fromPrefix.length)
        }
      }

      rewriteRefs(value, opts)
    }
  }
}

async function prepareJsonSchema(schema, components) {
  const result = await jsonSchemaRefParser.dereference(schema)

  // update all $refs from '#/definitions/' to '#/components/schemas/'
  rewriteRefs(result, {
    fromPrefix: '#/definitions/',
    toPrefix: '#/components/schemas/'
  })

  // prune custom FTS keywords
  pruneCustomKeywords(result)

  // prune incompatible types
  pruneTypes(result)

  // TODO: how should we handle duplicates here?
  components.schemas = {
    ...components.schemas,
    ...result.definitions
  }

  // all $refs have been replaced directly, so remove any indirect definitions
  delete result.$ref
  delete result.definitions

  return result
}

module.exports.serviceToPaths = async function serviceToPaths(
  service,
  components
) {
  const { route, definition } = service
  const result = {}

  // ---------------------------------------------------------------------------
  // Parameters
  // ---------------------------------------------------------------------------

  const {
    http: isRawHttpRequest = false,
    schema: paramsSchema
  } = definition.params

  let requestBody
  let requestSchema

  if (isRawHttpRequest) {
    requestSchema = {
      type: 'string',
      format: 'binary',
      description:
        'Raw HTTP request body which can be interpreted using the standard `Content-Type` header.'
    }

    requestBody = {
      required: true,
      content: {
        '*/*': {
          schema: requestSchema
        }
      }
    }
  } else {
    const params = await prepareJsonSchema(paramsSchema, components)
    requestSchema = jsonSchemaToOpenAPI(params)

    requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: requestSchema
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Example Usage
  // ---------------------------------------------------------------------------

  let examplesOrdered
  let examples

  if (service.examples) {
    examplesOrdered = service.examples.filter(
      (example) =>
        !example.inputContentType ||
        example.inputContentType === 'application/json'
    )

    if (examplesOrdered.length) {
      examples = examplesOrdered.reduce(
        (acc, example) => ({
          ...acc,
          [example.name]: example.input
        }),
        {}
      )

      // infer example values for all parameters from the list of provided example inputs
      for (const [name, schema] of Object.entries(requestSchema.properties)) {
        let found = false

        for (const example of Object.values(examples)) {
          for (const [key, value] of Object.entries(example)) {
            if (key === name) {
              schema.example = value
              found = true
              break
            }
          }

          if (found) {
            break
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Responses
  // ---------------------------------------------------------------------------

  const { returns = {} } = definition
  const { http: isRawHttpResponse = false, schema: responseSchema } = returns
  let responses = {
    200: {
      description: 'Success'
    }
  }

  if (responseSchema) {
    const { type, additionalProperties, properties, ...rest } = responseSchema

    if (isRawHttpResponse) {
      const responseSchema = {
        type: 'string',
        format: 'binary',
        description:
          'Raw HTTP response body which can be interpreted using the standard `Content-Type` header.'
      }

      responses = {
        200: {
          description: 'Success',
          content: {
            // TODO: support restriction response content-types via OpenAPI `produces` prop
            '*/*': {
              schema: responseSchema
            }
          }
        }
      }
    } else {
      const returnsJsonSchema = {
        ...rest,
        ...properties.result
      }
      const returns = await prepareJsonSchema(returnsJsonSchema, components)
      const responseSchema = jsonSchemaToOpenAPI(returns)

      responses = {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: responseSchema
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // POST Operation
  // ---------------------------------------------------------------------------

  if (service.POST !== false) {
    const post = {
      requestBody,
      responses
    }

    if (examples) {
      const example = codegen(service, null, {
        method: 'POST'
      })

      post['x-code-samples'] = example.snippets.map((sample) => ({
        lang: sample.language,
        label: sample.label,
        source: sample.code
      }))

      if (!isRawHttpRequest) {
        post.requestBody.content['application/json'].example =
          examplesOrdered[0].input
      }
    }

    if (definition.description) {
      post.description = definition.description
    }

    result.post = post
  }

  // ---------------------------------------------------------------------------
  // GET Operation
  // ---------------------------------------------------------------------------

  if (service.GET !== false) {
    const parameters = []

    for (const [name, schema] of Object.entries(requestSchema.properties)) {
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
          definitions: requestSchema.definitions
        }
      }

      if (requestSchema.required && requestSchema.required.indexOf(name) >= 0) {
        param.required = true
      }

      parameters.push(param)
    }

    const get = {
      parameters,
      responses
    }

    if (examples) {
      const example = codegen(service, null, {
        method: 'GET'
      })

      get['x-code-samples'] = example.snippets.map((sample) => ({
        lang: sample.language,
        label: sample.label,
        source: sample.code
      }))
    }

    if (definition.description) {
      get.description = definition.description
    }

    result.get = get
  }

  return {
    [route]: result
  }
}
