<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-to-openapi

> Converts [Saasify](https://saasify.sh) deployments to [OpenAPI](https://swagger.io/docs/specification/about) specs.

[![NPM](https://img.shields.io/npm/v/saasify-to-openapi.svg)](https://www.npmjs.com/package/saasify-to-openapi) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-to-openapi
```

## Usage

```js
const convertSaasifyToOpenAPI = require('saasify-to-openapi')
const deployment = { /* ... */ }

const openAPI = await convertSaasifyToOpenAPI(deployment)
```

## Examples

See the test [fixtures](./fixtures) and their corresponding output [snapshots](./.snapshots/test.js.md) for conversion examples.

## TODO

Should any of these be injected by the saas client?

- [ ] info.x-logo
- [ ] info.termsOfService
- [ ] info.contact
- [ ] info.license (look into licensing options)
- [ ] info.description
- [ ] tags
- [ ] update correct path routes
- [ ] operation.security
- [ ] apiKey => API Key
- [ ] update security section
- [ ] add GET path

## Related

- [saasify](https://saasify.sh) - Saasify is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.
- [OpenAPI](https://swagger.io/docs/specification/about) - API specification.

## License

MIT © [Saasify](https://saasify.sh)
