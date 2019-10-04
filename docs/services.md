[header](_header.md ':include')

# Services

All generated service endpoints are organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). They accept [JSON-encoded](http://www.json.org/) request bodies, return JSON-encoded responses, and use standard HTTP response codes, authentication, and verbs.

## OpenAPI

Every deployment comes with a corresponding [OpenAPI spec](https://swagger.io/specification) that fully describes its service endpoints.

Here is an example auto-generated OpenAPI [spec](https://api.saasify.sh/1/deployments/openapi/transitive-bullshit/puppet-master@b0c5c30c), as well as its corresponding [docs](https://puppet-master.sh/docs/api). These docs are available for every SaaS web client, and they use [Redoc](https://github.com/Redocly/redoc) to display the OpenAPI spec for any given deployment.

!> Note that [OpenAPI](https://swagger.io/specification) was previously called Swagger.

## HTTP

By default, all generated service endpoints are available via `HTTP GET` with query parameters as well as `HTTP POST` with `application/json` encoded body parameters.

!> All API requests must be made over HTTPS. Calls made to the production API over plain HTTP will fail. The one exception to this is when debugging your project locally via `saasify dev`, in which case all `localhost` API calls must be made over HTTP.

## Content Type

All requests must be encoded as JSON with the `Content-Type: application/json` header. If not otherwise specified, responses from the API, including errors, are encoded exclusively as JSON as well.

By default, all service endpoints return JSON, though we allow individual services to opt out of type checking and return raw HTTP bodies directly. This is especially useful for processing media such as images.

## Rate Limits

With the public, non-authenticated version of a service, we limit the number of calls you can make over a certain period of time. Rate limits vary and are specified by the following headers in all responses:

| Header | Description |
| ------ | ----------- |
| `X-RateLimit-Limit` | The maximum number of requests that the consumer is permitted to make. |
| `X-RateLimit-Remaining` | The number of requests remaining in the current rate limit window. |
| `X-RateLimit-Reset` | The time at which the current rate limit window resets in UTC epoch seconds. |

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

All service endpoints use conventional HTTP response codes to indicate the success or failure of an API request. In general, codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, endpoint not found, etc.). Codes in the `5xx` range indicate an error with our API (these should hopefully be rare).

## Versioning

All published deployment versions are **immutable** which guarantees that once a customer has a working integration, it will always be completely optional for them to upgrade to newer versions.

When making backwards-incompatible changes to a project or changing pricing, you are required to publish a new major version following standard [semver](https://semver.org) conventions.

<p align="center">
  <img src="./_media/undraw/version_control.svg" alt="API Version Control" width="200" />
</p>

## Auth Tokens

All service endpoints accept an optional auth token for authenticated access. Unauthenticated (public) requests are subject to rate limiting.

Subscribers can view and manage their auth token(s) in their client dashboard. Be sure to keep your auth tokens secure. Do not share them in publicly accessible areas such as GitHub, client-side code, and so forth.

<p align="center">
  <img src="./_media/undraw/security.svg" alt="Security" width="200" />
</p>
