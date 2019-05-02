# fin-to-openapi

> Converts [Fin](https://functional-income.com) deployments to [OpenAPI](https://swagger.io/docs/specification/about) specs.

[![NPM](https://img.shields.io/npm/v/fin-to-openapi.svg)](https://www.npmjs.com/package/fin-to-openapi) [![Build Status](https://travis-ci.com/functional-incomee/fin.svg?branch=master)](https://travis-ci.com/functional-incomee/fin) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install fin-to-openapi
```

## Usage

```js
const convertFinToOpenAPI = require('fin-to-openapi')
const finDeployment = { /* ... */ }

const openAPI = convertFinToOpenAPI(finDeployment)
```

## Related

- [fin](https://functional-income.com) - Fin is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.
- [OpenAPI](https://swagger.io/docs/specification/about) - API specification.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
