'use strict'

// TODO: switch to using https://github.com/openapi-contrib/json-schema-to-openapi-schema
// TODO: move codegen into annotateOpenAPI so all deployments can use it
// TODO: move all examples and request params "example" value inference into annotateOpenAPI

const jsonSchemaToOpenAPISchema = require('json-schema-to-openapi-schema')
const pReduce = require('p-reduce')
const codegen = require('saasify-codegen')

const { prepareJsonSchema } = require('./lib/prepare-json-schema')

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
