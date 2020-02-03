'use strict'

const cloneDeep = require('clone-deep')
const processReadme = require('./process-readme')

// TODO: this logic should be deprecated
const nameRe = /\/([^/]*)$/

/**
 * Annotates a valid OpenAPI spec with extra metadata specific to Saasify's
 * SaaS web client and [Redoc](https://github.com/Redocly/redoc).
 */
module.exports = async (spec, deployment, opts = {}) => {
  const { baseUrl = 'https://ssfy.sh' } = opts

  const api = cloneDeep(spec)
  const version = deployment.version ? `v${deployment.version}` : undefined

  api.servers = [{ url: baseUrl }]
  api.security = [{ 'API Key': [] }]

  api.tags = [
    {
      name: 'service',
      'x-displayName': 'APIs'
    }
  ]

  const readmeRaw = deployment.readme || ''

  const { readme, quickStart, supportingOSS } = processReadme(readmeRaw)

  api.info = {
    ...api.info,
    title: deployment.project.name,
    version,
    termsOfService: '/terms',
    contact: {
      name: 'API Support',
      email: 'support@saasify.sh'
    },
    description: `
${quickStart || readme}

# Configuration

## API

This API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Unless otherwise specified, API endpoints accept [JSON-encoded](http://www.json.org/) request bodies, return JSON-encoded responses, and use standard HTTP response codes, authentication, and verbs.

## Content Type

Unless otherwise specified, all requests must be encoded as JSON with the \`Content-Type: application/json\` header. Unless otherwise specified, responses from the API, including errors, are encoded exclusively as JSON as well.

## Authentication

### API Key

Optional API key for authenticated access. Note that we use "auth token" and "API key" interchangably in these docs.

Unauthenticated (public) requests are subject to rate limiting. See [pricing](/pricing) for specifics on these rate limits.

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

Also note that all API requests must be made over **HTTPS**. Calls made over plain HTTP will fail.

## Rate Limits

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

## Errors

This API uses conventional HTTP response codes to indicate the success or failure of API requests. In general: Codes in the \`2xx\` range indicate success. Codes in the \`4xx\` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, endpoint not found, etc.). Codes in the \`5xx\` range indicate an error with our API (these are rare).

## Versioning

API versions are **immutable** which guarantees that once you have a working integration, it will always be completely optional to upgrade to newer versions.

When we make backwards-incompatible changes to an API, we release new versions following [semver](https://semver.org/). The current version is \`${version}\`.

You can visit your [Dashboard](/dashboard) to manage your API version.

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

  for (const path of Object.keys(api.paths)) {
    const pathItem = api.paths[path]
    const name = path.match(nameRe)[1]

    for (const httpMethod of Object.keys(pathItem)) {
      const op = pathItem[httpMethod]
      op.tags = ['service']

      if (!op.operationId) {
        op.operationId = `${name}${httpMethod.toUpperCase()}`
      }

      if (!op.summary) {
        op.summary = `${name} (${httpMethod.toUpperCase()})`
      }

      const { responses } = op

      if (!responses['400']) {
        responses['400'] = {
          description: 'Invalid Input'
        }
      }

      if (!responses['429']) {
        responses['429'] = {
          description: 'Rate limit exceeded'
        }
      }

      delete op.security
    }
  }

  return api
}
