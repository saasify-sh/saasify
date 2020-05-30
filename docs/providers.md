[header](_header.md ':include')

# Auth Providers

One of Saasify's most powerful features is the ability to specify external OAuth providers that your customers will be able to authenticate with.

This is an advanced feature that's intended to simplify building SaaS products that need to integrate with third-party services.

You can enable / disable different providers, mark them as required in order to use your API, and customize their OAuth credentials and authorization scopes depending on your product's needs.

If you're interested in taking advantage of this feature and want help configuring your integration, please [get in touch](support.md).

> An example use case would be requiring that all your customers authenticate via `google` with custom OAuth `scopes` that gives your API access to a customer's Google Sheets (or any other Google properties on behalf of that user).

## Supported Providers

- Google
- GitHub
- Twitter
- LinkedIn
- Stripe
- Spotify

Interested in an integration with a third-party service provider that's not currently supported? Please [get in touch](support.md).

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
  linkedin?: AuthProviderConfig
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
