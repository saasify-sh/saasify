[header](_header.md ':include')

# Services

A Service in Saasify refers to one of your API's individual HTTP endpoints.

You can optionally customize how Saasify's API gateway proxies each of your API's services for:

- Fine-grained control over rate limiting
- Usage reporting
- Restricting access to certain pricing plans
- Response headers and caching
- Custom example inputs and code snippets

```ts
class Config {
  // saasify.json properties...

  // optional API endpoint config
  services?: Service[]
}

class Service {
  // the combination of HTTP path (beginning with /) and HTTP method uniquely identify a service
  path?: string
  httpMethod?: string = 'GET'

  name?: string
  examples?: Example[]

  // optional customization of response headers
  headers?: object
  immutable?: boolean

  // whether to report calls to this service (only applicable to metered billing)
  reportUsage?: boolean = true

  // disable or customize this service's rate limits (defaults to the active pricing plan's rate limits)
  rateLimit?: null | RateLimit

  // customize this service depending on the active pricing plan
  pricingPlanConfig?: PricingPlanServiceConfigMap
}

class PricingPlanServiceConfigMap {
  // map of pricing plan slug to service config overrides for a given plan
  [plan: string]: PricingPlanServiceConfig
}

class PricingPlanServiceConfig {
  // whether this service is enabled for a given pricing plan
  enabled?: boolean

  // whether to report calls to this service on a given pricing plan (for metered usage)
  reportUsage?: boolean

  // disable or customize this service's rate limits for a given pricing plan
  rateLimit?: null | RateLimit
}

class Example {
  name: string
  description?: string
  input: object
  inputContentType?: string = 'application/json'
  snippet?: Snippet
  output?: any // only necessary if you want to mock output and not use the real output from your API
}

class Snippet {
  language: string
  label: string
  code: string
  exclusive?: boolean = false
}
```

## HTTPS

All HTTP calls via Saasify's API gateway should be made over **HTTPS**. Calls made to your production API over plain HTTP will be automatically upgraded to HTTPs, but this use case is discouraged.

## Content Type

We recommend that all endpoints dealing with non-binary data accept and return JSON via `Content-Type: application/json`.

Unless otherwise specified, responses and error messages from the API gateway, are encoded exclusively as JSON.

## Rate Limits

With the public, non-authenticated version of a service, we limit the number of calls you can make over a certain period of time. Rate limits vary and are specified by the following headers in all responses:

| Header                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `X-RateLimit-Limit`     | The maximum number of requests that the consumer is permitted to make.       |
| `X-RateLimit-Remaining` | The number of requests remaining in the current rate limit window.           |
| `X-RateLimit-Reset`     | The time at which the current rate limit window resets in UTC epoch seconds. |

When the rate limit is **exceeded**, an error is returned with the status "**429 Too Many Requests**":

```json
{
  "error": {
    "code": "too_many_requests",
    "message": "Rate limit exceeded"
  }
}
```

## Errors

All service endpoints should use conventional HTTP response codes to indicate the success or failure of an API request. In general, codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, endpoint not found, etc.). Codes in the `5xx` range indicate an error with either our API gateway (these should hopefully be rare) or your downstream API server.

## Versioning

All published deployment versions are **immutable** which guarantees that once a customer has a working integration, it will always be optional for them to upgrade to newer versions.

When making backwards-incompatible changes or changing pricing, you are required to publish a new major version of your project following standard [semver](https://semver.org) conventions.

<p align="center">
  <img src="./_media/undraw/version_control.svg" alt="API Version Control" width="200" />
</p>

## Authentication

All service endpoints optionally accept a standard bearer auth token via an `Authentication` header (`Authentication: Bearer ${token}`).

Your customers can view and manage their auth token(s) from their client dashboard once they sign up for your product.

Authentication and authorization are handled transparently by Saasify's API gateway, so you can focus on your API's core functionality.

Your downstream API will receive two additional headers for authenticated requests that you can use to customize your service's functionality:

- `x-saasify-user` - String ID of the authenticated customer making the API call.
- `x-saasify-plan` - String slug of the pricing plan that this user is subscribed to.

For unauthenticated calls, these headers are guaranteed to not exist when Saasify's API gateway proxies these calls to your downstream API.

<p align="center">
  <img src="./_media/undraw/security.svg" alt="Security" width="200" />
</p>
