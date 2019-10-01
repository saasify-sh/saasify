[header](_header.md ':include')

# Concepts

This is a breakdown of the core resource models used by the Saasify platform.

## Service

A `Service` is a single monetizable serverless function or FaaS. For Saasify v1, it is written in TypeScript and configured via its parent `Project`.

Services conform to the [Functional TypeScript](https://github.com/transitive-bullshit/functional-typescript) specification. This strong typing allows Saasify to automatically generate documentation, client SDKs, and examples for all services.

By default, every service deployed on Saasify is publicly available and rate-limited by IP address. Other developers can *subscribe* to your Project's API in order to gain access to higher rate limits and usage-based pricing.

See [services](./services.md) for more detail on auto-generated service endpoints.

## Project

A `Project` is a collection of related `Services`. It is specified by a Saasify config file `saasify.json` which has the following format:

```ts
class Config {
  saasifyVersion?: number = 1
  version?: string = 0.1.0
  name?: string
  amountPerBase?: number = 99
  amountPerRequest?: number = 0.0004
  amountPerCompute?: number = 0.0034
  amountPerBandwidth?: number = 0.2
  authRateLimit?: RateLimit
  noAuthRateLimit?: RateLimit
  services: Service[]
}

class Service {
  src: string
  name?: string
  timeout?: number = 0
  examples?: Example[]
}

class Example {
  name: string
  input: object
  output?: string | object
}

class RateLimit {
  requests?: boolean = true
  requestsInterval?: number = 60000
  requestsMaxPerInterval?: number = 1000
}
```

An example `saasify.json` config file could look like:

```
{
  "name": "hello-world",
  "services": [
    {
      "src": "./src/hello-world.ts",
      "name": "helloWorld"
    }
  ]
}
```

This config specifies a `Project` named `hello-world` with a single service generated from the specified `src` TypeScript file relative to the project root. All pricing and rate limits will use platform defaults.

See [configuration](./configuration.md) for more details on configuring projects.

## Deployment

Every time you deploy a `Project`, you create an **immutable** `Deployment`.

Relevant CLI commands:

- `saasify deploy` creates a new deployment
- `saasify logs` prints logs for a deployment
- `saasify ls` lists existing deployments for a given project
- `saasify rm` removes deployments for a given project

A `Project` can have any positive number of Deployments. Unused deployments don't cost any money but may pose a security risk, so we recommend pruning old deployments as your organization sees fit.

## User

All makers and developers subscribing to SaaS products have an associated `User` model. The default auth method is GitHub, but email, username, and password is also supported.

## Consumer

A `Consumer` maps a `User` to a `Project` via a SaaS subscription. Every time a user signs up for a subscription, that metadata is stored in a `Consumer` model.

One User may have zero or more `Consumers` depending on the number of projects subscriptions they have.

One Project may have zero or more `Consumers` depending on how many users have subscribed to the project.

<p align="center">
  <img src="./_media/undraw/creative_thinking.svg" alt="Creative thinking" width="200" />
</p>
