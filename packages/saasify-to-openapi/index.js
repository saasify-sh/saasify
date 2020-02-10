'use strict'

// TODO: switch to using https://github.com/openapi-contrib/json-schema-to-openapi-schema

const jsonSchemaToOpenAPISchema = require('json-schema-to-openapi-schema')
const pReduce = require('p-reduce')

const { prepareJsonSchema } = require('./lib/prepare-json-schema')

/**
 * Converts a Saasify Deployment into an OpenAPI spec.
 *
 * Note that this is only used for deployments powered by FTS, as all other
 * deployments are derived from an OpenAPI spec.
 *
 * @return {Promise}
 */
module.exports = async function saasifyToOpenAPI(deployment) {
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
    requestSchema = jsonSchemaToOpenAPISchema(params)

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

  if (service.examples) {
    const examplesOrdered = service.examples.filter(
      (example) =>
        !example.inputContentType ||
        example.inputContentType === 'application/json'
    )

    if (examplesOrdered.length) {
      const examples = examplesOrdered.reduce(
        (acc, example) => ({
          ...acc,
          [example.name]: example.input
        }),
        {}
      )

      // TODO: we'd really like to move this into annotate-openapi so all schemas
      // can benefit from it.

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
            // TODO: support restricted response content-types via OpenAPI `produces` prop
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
      const responseSchema = jsonSchemaToOpenAPISchema(returns)

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

    if (definition.description) {
      get.description = definition.description
    }

    result.get = get
  }

  return {
    [route]: result
  }
}
