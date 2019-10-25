'use strict'

const cloneDeep = require('clone-deep')

const nameRe = /\/([^/]*)$/

/**
 * Annotates a valid OpenAPI spec with
 */
module.exports = async (spec, deployment, opts = { }) => {
  const {
    baseUrl = 'https://api.saasify.sh'
  } = opts

  const api = cloneDeep(spec)
  const version = deployment.version
    ? `v${deployment.version}`
    : undefined

  api.servers = [ { url: baseUrl } ]
  api.security = [ { 'API Key': [] } ]

  api.tags = [
    {
      name: 'service',
      'x-displayName': 'Services'
    }
  ]

  api.info = {
    ...api.info,
    title: deployment.project.name,
    version,
    termsOfService: '/terms',
    contact: {
      name: 'API Support',
      email: 'support@saasify.sh'
    },
    license: {
      name: 'Apache 2.0'
    },
    description: `
${deployment.readme}

# Introduction

This API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API accepts [JSON-encoded](http://www.json.org/) request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

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

API versions are **immutable** which guarantees that once you have a working integration, it will always be completely optional to upgrade to newer versions.

When we make backwards-incompatible changes to an API, we release new versions following [semver](https://semver.org/). The current version is \`${version}\`.

You can visit your [Dashboard](/dashboard) to manage your API version.
`
  }

  if (deployment.saas.logo) {
    api.info['x-logo'] = {
      url: deployment.saas.logo,
      altText: deployment.project.name,
      href: '/'
    }
  }

  api.components = {
    ...api.components,
    securitySchemes: {
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
