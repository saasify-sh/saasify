'use strict'

const jsonSchemaToOpenAPI = require('json-schema-to-openapi-schema')
const jsonSchemaRefParser = require('json-schema-ref-parser')
const pReduce = require('p-reduce')
const { URL } = require('url')

module.exports = async function finToOpenAPI (deployment, opts = { }) {
  const {
    baseUrl = 'https://api.functional-income.com'
  } = opts

  const url = module.exports.normalizeUrl(deployment.url, baseUrl)

  const paths = await pReduce(deployment.services, async (paths, service) => ({
    ...paths,
    ...(await module.exports.serviceToPath(service))
  }), { })

  const spec = {
    openapi: '3.0.2',
    info: {
      title: deployment.project,
      version: deployment.version
    },
    servers: [
      {
        url
      }
    ],
    paths,
    security: [
      {
        apiKey: []
      }
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          description: 'Optional API key for authenticated access.',
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

module.exports.serviceToPath = async function serviceToPath (service) {
  const {
    route,
    definition,
    name
  } = service

  const params = await prepareSchema(definition.params.schema)
  const returns = await prepareSchema(definition.returns.schema)

  const paramsSchema = jsonSchemaToOpenAPI(params)
  const responseSchema = jsonSchemaToOpenAPI(returns)

  return {
    [route]: {
      post: {
        operationId: name,
        summary: definition.description || service.name,
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
    }
  }
}
