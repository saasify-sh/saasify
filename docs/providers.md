[header](_header.md ':include')

# Auth Providers

One of Saasify's most powerful features is the ability to customize external OAuth providers that your customers will be able to authenticate with. Some example providers include `google`, `github`, `twitter`, and `spotify`.

This is an advanced feature that's intended to simplify building SaaS products that integrate with third-party services.

You can enable / disable different providers, mark them as required, and customize their OAuth credentials and authorization scopes depending on your product's needs.

An example use case would be requiring that all your customers authenticate via `google` with custom OAuth `scopes` that gives your API access to an authenticated customer's Google Sheets (or any other Google properties on behalf of that user).

If you're interested in taking advantage of this advanced feature and want help configuring your integration, please [get in touch](support.md).

## Schema

```ts
class Config {
  // saasify.json properties...

  // optional external auth provider config (google, github, twitter, etc)
  authProviders?: AuthProviderMap
}

class AuthProviderMap {
  github?: AuthProviderConfig
  google?: AuthProviderConfig
  spotify?: AuthProviderConfig
  twitter?: AuthProviderConfig

  // default auth provider is email & password
  default?: AuthProviderConfig
}

class AuthProviderConfig {
  enabled?: boolean
  required?: boolean

  clientId?: string
  clientSecret?: string

  scopes?: string[]
}
```

## New Providers

Interested in an integration with another third-party service provider? Please [get in touch](support.md).
