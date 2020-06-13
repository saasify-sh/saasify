'use strict'

const cloneDeep = require('clone-deep')
const contentType = require('content-type')
const codegen = require('saasify-codegen')
const { parseFaasIdentifier } = require('saasify-faas-utils')

const openapiHeaderBlacklist = require('./openapi-header-blacklist')
const pathToService = require('./path-to-service')
const processReadme = require('./process-readme')
const isHttpMethod = require('./is-http-method')

/**
 * Annotates a valid OpenAPI spec with extra metadata specific to Saasify's SaaS web client
 * and [Redoc](https://github.com/Redocly/redoc).
 *
 * @param {object} spec - OpenAPI spec.
 * @param {object} deployment - Parent Saasify deployment.
 * @param {object} [opts] - Optional config.
 *
 * @return {Promise}
 */
module.exports = async (spec, deployment, opts = {}) => {
  const { baseUrl = 'https://ssfy.sh' } = opts

  const api = cloneDeep(spec)
  const version = deployment.version ? `v${deployment.version}` : undefined
  api.paths = api.paths || {}

  const paths = Object.keys(api.paths)

  // It's important that we overwrite the downstream origin servers and any security
  // requirements they may use.
  api.servers = [{ url: baseUrl }]
  api.security = [{ 'API Key': [] }]

  api.tags = api.tags || []

  if (paths.length) {
    api.tags = api.tags.concat([
      {
        name: 'Endpoints',
        'x-displayName': 'Endpoints'
      }
    ])
  }

  const readmeRaw = deployment.readme || ''

  const { readme, quickStart, supportingOSS } = processReadme(readmeRaw)
  const sections = (deployment.saas && deployment.saas.sections) || {}

  api.info = {
    ...api.info,
    title: deployment.project.name,
    version,
    termsOfService: '/terms',
    contact: {
      name: 'API Support',
      email:
        (sections.navHeader && sections.navHeader.support) ||
        'support@saasify.sh'
    },
    description: `
${quickStart || readme}

# API

## Authentication

### API Key

Optional API key for authenticated access. Note that we use "auth token" and "API key" interchangably in these docs.

Authenticated requests must include an \`Authorization\` header containing your subscription's auth token.

| Security Schema Type | Header Name | Example Token |
| --- | --- | --- |
| API Key | \`Authorization\` | aebfbb4729a300da7cc5c470 |

In the following example, \`TOKEN\` represents the auth token for your account.

\`\`\`
curl --header 'authorization: TOKEN'
\`\`\`

You can view and manage your auth tokens in the [Dashboard](/dashboard).

Be sure to keep your auth tokens secure. Do not share them in publicly accessible areas such as GitHub, client-side code, and so forth.

Also note that all API requests must be made over **HTTPS**. Calls made over plain HTTP will attempt to be automatically upgraded to HTTPS, though this use cases is discouraged.

${
  !sections.docs || sections.docs.rateLimits !== false
    ? `
## Rate Limits

API requests may be rate limited depending on your subscription plan and traffic patterns. The following response headers will be present in these cases:

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

`
    : ''
}

## Errors

This API uses conventional HTTP response codes to indicate the success or failure of API requests. In general: Codes in the \`2xx\` range indicate success. Codes in the \`4xx\` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, endpoint not found, etc.). Codes in the \`5xx\` range indicate an error with our API (these are rare).

${supportingOSS}
`
  }

  api.components = {
    ...api.components,
    securitySchemes: {
      ...(api.components && api.components.securitySchemes),
      'API Key': {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: `Optional API key for authenticated access.


Unauthenticated (public) requests are subject to rate limiting. See [pricing](/pricing) for specifics on these rate limits.

You can view and manage your API key in the [Dashboard](/dashboard).

Be sure to keep your API key secure. Do not share it in publicly accessible areas such as GitHub, client-side code, and so forth.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail.`
      }
    }
  }

  for (const path of paths) {
    const pathItem = api.paths[path]

    annotatePathItem({ pathItem, path, api, deployment })
  }

  return api
}

function annotatePathItem({ pathItem, path, api, deployment }) {
  // TODO: ideally we wouldn't need to treat openapi and non-openapi deployments differently here
  const needsFullRoute = !!deployment.openapi

  if (!needsFullRoute) {
    const parsedPath = parseFaasIdentifier(path)
    if (parsedPath) {
      path = parsedPath.servicePath
    }
  }

  const service = pathToService(path, deployment)
  if (!service) {
    throw new Error(`Unable to find matching service for path "${path}"`)
  }

  const { name, route } = service

  if (needsFullRoute) {
    delete api.paths[path]
    api.paths[route] = pathItem
  }

  const httpMethods = Object.keys(pathItem).filter(isHttpMethod)

  for (const httpMethod of httpMethods) {
    const op = pathItem[httpMethod]
    op.tags = ['Endpoints']

    if (!op.operationId) {
      op.operationId = `${name}${httpMethod.toUpperCase()}`
    }

    if (!op.summary) {
      op.summary = `${name} (${httpMethod.toUpperCase()})`
    }

    annotateOperationParameters({ op, httpMethod, service })
    annotateOperationResponses({ op, httpMethod, service })
    annotateOperationCodeSamples({ op, httpMethod, service })

    // TODO: not sure what to do with this...
    delete op.security

    // TODO: move codegen and example logic from saasify-to-openapi into here
  }
}

function annotateOperationParameters({ op }) {
  if (!op.parameters) {
    return
  }

  op.parameters = op.parameters.filter((param) => {
    if (param.in === 'header' && openapiHeaderBlacklist.has(param.name)) {
      return false
    }

    return true
  })
}

function annotateOperationResponses({ op, service }) {
  const { responses } = op

  if (!responses) {
    return
  }

  if (!responses['400']) {
    responses['400'] = {
      description: 'Invalid input'
    }
  }

  if (!responses['429']) {
    responses['429'] = {
      description: 'Rate limit exceeded'
    }
  }

  // add concrete examples to the JSON success responses
  const success = responses['200']
  if (success) {
    const mediaType = success.content && success.content['application/json']

    annotateMediaTypeExamples({ mediaType, service })
  }
}

function annotateOperationCodeSamples({ op, httpMethod, service }) {
  let example

  try {
    example = codegen(service, null, { method: httpMethod.toUpperCase() })
  } catch (err) {
    console.warn('codegen warning', err.message)
  }

  if (example && !op['x-code-samples']) {
    op['x-code-samples'] = example.snippets.map((sample) => ({
      lang: sample.language,
      label: sample.label,
      source: sample.code
    }))
  }

  const mediaType =
    op.requestBody &&
    op.requestBody.content &&
    op.requestBody.content['application/json']

  annotateMediaTypeExamples({ mediaType, service })
}

function annotateMediaTypeExamples({ mediaType, service }) {
  if (mediaType) {
    if (!mediaType.examples || !Object.keys(mediaType.examples).length) {
      mediaType.examples = service.examples.reduce((acc, example) => {
        const ct = contentType.parse(example.inputContentType)
        const type = ct && ct.type

        if (type !== 'application/json') {
          return acc
        }

        const ex = { summary: example.name, description: example.description }
        if (example.inputUrl) {
          ex.externalValue = example.inputUrl
        } else {
          ex.value = example.input
        }

        return {
          ...acc,
          [example.name]: ex
        }
      }, {})

      if (!Object.keys(mediaType.examples).length) {
        delete mediaType.examples
      }
    }
  }
}
