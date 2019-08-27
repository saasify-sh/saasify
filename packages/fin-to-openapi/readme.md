# saasify-to-openapi

> Converts [Saasify](https://saasify.xyz) deployments to [OpenAPI](https://swagger.io/docs/specification/about) specs.

[![NPM](https://img.shields.io/npm/v/saasify-to-openapi.svg)](https://www.npmjs.com/package/saasify-to-openapi) [![Build Status](https://travis-ci.com/saasifye/saasify.svg?branch=master)](https://travis-ci.com/saasifye/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install saasify-to-openapi
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

- [saasify](https://saasify.xyz) - Saasify is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.
- [OpenAPI](https://swagger.io/docs/specification/about) - API specification.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
