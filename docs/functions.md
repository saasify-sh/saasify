<a href="https://github.com/transitive-bullshit/functional-typescript" title="Functional TypeScript" style="display: inline-block; margin: 0 auto 2em; text-align: center; width: 100%;">
  <img src="https://raw.githubusercontent.com/transitive-bullshit/functional-typescript/master/logo.png" alt="FTS Logo" width="150" />
</a>

# Functions

Services in Saasify v1 are built on top of standard TypeScript functions which are transformed into type-safe serverless endpoints using [FTS](https://github.com/transitive-bullshit/functional-typescript).

!> This all happens under the hood. **All you have to do is understand and write TypeScript**.

## Basic Example

```ts
// index.ts
export default (name = 'World') => {
  return `Hello ${name}!`
}
```

To view the full source for this example, visit [hello-world](https://github.com/saasify-sh/saasify/tree/master/examples/hello-world).

## Advanced Example

[screenshot.ts](./includes/screenshot.ts ':include :type=code')

To view the full source for this example, visit [puppet-master](https://github.com/saasify-sh/puppet-master).

<p align="center">
  <img src="./_media/undraw/programming.svg" alt="Programming" width="200" />
</p>

## Best Practices

Any valid TypeScript function may be used as the source for a service. It should either be the default export of the source `ts` file or there should only be one named export in the file.

We recommend limiting top-level TypeScript functions to one export per source file.

Aside from that, you can use / import any valid TypeScript, including from third-party NPM modules. Just install them normally to your project's `package.json` file.

Note that Saasify currently doesn't support custom `tsconfig` files.

## Parameters

?> TODO

## Raw HTTP Return Type

The advanced example above shows how you can bypass strict return types and return any HTTP content directly.

This is especially useful for returning media such as images, documents, or video.

To enable this for a service, first add `fts-core` as a dependency.

```bash
npm install --save fts-core
# or
yarn add fts-core
```

Then, in your TypeScript function, change the return type to either `HttpResponse` or `Promise<HttpResponse>` and change your return value to include `headers`, `statusCode`, and `body` following the example below.

```ts
import { HttpResponse } from 'fts-core'

// 1x1 png from http://www.1x1px.me/
const image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII='

export default async function generateImage(): Promise<HttpResponse> {
  return {
    headers: { 'Content-Type': 'image/png' },
    statusCode: 200,
    body: Buffer.from(image, 'base64')
  }
}
```

Any `headers` you add will be forwarded downstream, and `body` should be a `Buffer` object.

Note that there is currently no equivalent option for bypassing parameter checking.

## Troubleshooting

Saasify v1 uses [FTS](https://github.com/transitive-bullshit/functional-typescript) to transform TypeScript functions into type-safe serverless endpoints. We also use [saasify-to-openapi](https://github.com/saasify-sh/saasify/master/packages/saasify-to-openapi) to convert these JSON Schema specs to [OpenAPI](https://swagger.io/specification/).

While this cuts down significantly on the manual work required to document and host serverless functions, sometimes this process fails for some combination of types.

If you're experiencing a spec error either from FTS or OpenAPI, please [open an issue](https://github.com/saasify-sh/saasify/issues) and let us know along with as much accompanying information as possible (preferably including a link to your source code).

In the future, the TypeScript requirement and reliance on FTS will be relaxed, but for now it provides the quickest and easiest way to self-document your SaaS APIs.

<p align="center">
  <img src="./_media/undraw/qa_engineers.svg" alt="Troubleshooting" width="200" />
</p>

## Known Issues

The following type will fail to generate a correct OpenAPI spec due to its ambiguous nature when dealing with untyped, string inputs like query parameters.

```ts
type Example = string | number
```

Symlinks will not be followed during deployment, so make sure that any dependencies are either contained in the project's root folder or are accessible via NPM following standard `package.json` resolution rules.

---

## FAQ

### Why Serverless?

Serverless functions allow your code to run on-demand and scale automatically both infinitely upwards and down to zero. They are great at minimizing cost in terms of infrastructure and engineering time, largely due to removing operational overhead and reducing the surface area for potential errors.

For more information, see [Why Serverless?](https://serverless.com/learn/why), and an excellent breakdown on the [Tradeoffs that come with Serverless](https://martinfowler.com/articles/serverless.html).

### Why FTS?

The serverless space has seen such rapid growth that tooling, especially across different cloud providers, has struggled to keep up. One of the major disadvantages of using serverless functions at the moment is that each cloud provider has their own conventions and gotchas, which can quickly lead to vendor lock-in.

For example, take the following Node.js serverless function defined across several cloud providers:

**AWS**

```js
exports.handler = (event, context, callback) => {
  const name = event.name || 'World'
  callback(null, `Hello ${name}!`)
}
```

**Azure**

```js
module.exports = function(context, req) {
  const name = req.query.name || (req.body && req.body.name) || 'World'
  context.res = { body: `Hello ${name}!` }
  context.done()
}
```

**GCP**

```js
const escapeHtml = require('escape-html')

exports.hello = (req, res) => {
  const name = req.query.name || req.body.name || 'World'
  res.send(`Hello ${escapeHtml(name)}!`)
}
```

**FTS**

```ts
export function hello(name: string = 'World'): string {
  return `Hello ${name}!`
}
```

FTS allows you to define **provider-agnostic** serverless functions while also giving you **strong type checking** and **built-in documentation** for free.

### How is FTS different from other RPC standards?

Functional TypeScript is a standard for declaring and invoking remote functions. This type of invocation is known as an [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) or remote procedure call.

Some other notable RPC standards include [SOAP](https://en.wikipedia.org/wiki/SOAP), [Apache Thrift](https://en.wikipedia.org/wiki/Apache_Thrift), and [gRPC](https://en.wikipedia.org/wiki/GRPC).

> So how does FTS fit into this picture?

First off, FTS is fully compatible with these other RPC standards, with a gRPC transport layer on the roadmap.

The default HTTP handler with JSON Schema validation is the simplest way of using FTS, but it's pretty straightforward to interop with other RPC standards. For example, to use FTS with gRPC, we need to convert the JSON Schemas into protocol buffers (both of which describe the types and format of data) and add a gRPC handler which calls our compiled target JS function. Of course, there are pros and cons to using HTTP vs gRPC, with HTTP being easier to use and debug and gRPC being more efficient and scalable.

The real benefit of FTS is that the remote function definitions are just standard TypeScript, without you having to worry about the complexities of gRPC, protocol buffers, or other RPC formats. **You only need to understand and write TypeScript.**

Couple that with the simplicity and scalability of serverless functions, and FTS starts to become really powerful, enabling any TypeScript developer to create rock solid serverless functions easier than ever before.

### How is FTS related to FaaSLang?

Functional TypeScript builds off of and shares many of the same design goals as [FaaSLang](https://github.com/faaslang/faaslang). The main difference is that FaaSLang's default implementation uses **JavaScript + JSDoc** to generate **custom schemas** for function definitions, whereas **FTS uses TypeScript** to generate **JSON Schemas** for function definitions.

In our opinion, the relatively mature [JSON Schema](https://json-schema.org) specification provides a more solid and extensible base for the core schema validation layer. JSON Schema also provides interop with a large ecosystem of existing tools and languages. For example, it would be relatively simple to **extend FTS beyond TypeScript** to generate JSON Schemas from any language that is supported by [Quicktype](https://quicktype.io) (Go, Objective-C, C++, etc).

FTS also exposes a standard Node.js [http handler](https://nodejs.org/api/http.html#http_event_request) for invoking FTS functions `(req, res) => { ... }`. This makes it **extremely easy to integrate with popular Node.js server frameworks** such as [express](https://expressjs.com), [koa](https://koajs.com), and [micro](https://github.com/zeit/micro). While FaaSLang could potentially be extended to support more general usage, the default implementation currently only supports a custom API gateway server... which makes me a sad panda. 🐼
