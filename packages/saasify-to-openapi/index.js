'use strict'

const jsonSchemaToOpenAPI = require('json-schema-to-openapi-schema')
const jsonSchemaRefParser = require('json-schema-ref-parser')
const pReduce = require('p-reduce')
const { URL } = require('url')

module.exports = async function finToOpenAPI (deployment, opts = { }) {
  const {
    baseUrl = 'https://api.saasify.xyz'
  } = opts

  // const url = module.exports.normalizeUrl(deployment.url, baseUrl)

  const paths = await pReduce(deployment.services, async (paths, service) => ({
    ...paths,
    ...(await module.exports.serviceToPaths(service))
  }), { })

  const spec = {
    openapi: '3.0.2',
    info: {
      title: deployment.project.name,
      version: `v${deployment.version}`,
      termsOfService: '/terms',
      contact: {
        name: 'API Support',
        email: 'support@saasify.xyz'
      },
      license: {
        name: 'Apache 2.0'
      },
      description: `
# Introduction

This API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts [JSON-encoded](http://www.json.org/) request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

# Content Type

All requests must be encoded as JSON with the \`Content-Type: application/json\` header. If not otherwise specified, responses from the API, including errors, are encoded exclusively as JSON as well.

# Rate Limits

With the public, non-authenticated version of the API, we limit the number of calls you can make over a certain period of time. Rate limits vary and are specified by the following header in all responses:

| Header | Description |
| ------ | ----------- |
| \`X-RateLimit-Limit\` | The maximum number of requests that the consumer is permitted to make. |
| \`X-RateLimit-Remaining\` | The number of requests remaining in the current rate limit window. |
| \`X-RateLimit-Reset\` | The time at which the current rate limit window resets in UTC epoch seconds. |

When the rate limit is **exceeded**, an error is returned with the status "**429 Too Many Requests**":

\`\`\`json
{
  "error": {
    "code": "too_many_requests",
    "message": "Rate limit exceeded"
  }
}
\`\`\`

# Errors

This API uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the \`2xx\` range indicate success. Codes in the \`4xx\` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, endpoint not found, etc.). Codes in the \`5xx\` range indicate an error with our API (these are rare).


# Versioning

All API versions are **immutable** so once you have a working integration, it will always be completely optional to upgrade to newer versions.

When we make backwards-incompatible changes to the API, we release new versions following [semver](https://semver.org/). The current version is \`v${deployment.version}\`.

You can visit your [Dashboard](/dashboard) to manage your API version.
`
    },
    servers: [
      {
        url: baseUrl
      }
    ],
    paths,
    security: [
      {
        apiKey: []
      }
    ],
    tags: [
      {
        name: 'service',
        'x-displayName': 'Services'
      }
    ],
    components: {
      securitySchemes: {
        'API Key': {
          type: 'apiKey',
          description: `Optional API key for authenticated access.


Unauthenticated (public) requests are subject to rate limiting. See [pricing](/pricing) for more details on unauthenticated rate limits.

You can view and manage your API key in the [Dashboard](/dashboard).

Be sure to keep your API key secure! Do not share them in publicly accessible areas such as GitHub, client-side code, and so forth.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail.`,
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  }

  return spec
}

module.exports.normalizeUrl = function normalizeUrl (url, baseUrl) {
  const urlA = new URL(url)
  const urlB = new URL(baseUrl)

  urlA.host = urlB.host
  urlA.port = urlB.port
  urlA.protocol = urlB.protocol

  return urlA.toString()
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
    definition,
    name
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

  const post = {
    operationId: name,
    tags: [ 'service' ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: paramsSchema
        }
      }
    },
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: responseSchema
          }
        }
      }
    }
  }

  if (definition.description) {
    post.description = definition.description
  }

  const parameters = [ ]

  for (const [ name, schema ] of Object.entries(paramsSchema.properties)) {
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

    parameters.push(param)
  }

  const get = {
    operationId: name,
    tags: [ 'service' ],
    parameters,
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: responseSchema
          }
        }
      }
    }
  }

  if (definition.description) {
    get.description = definition.description
  }

  return {
    [route]: { post, get }
  }
}
