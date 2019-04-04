# fin-client

> Universal HTTP client for [Fin](htts://functional-income.com).

[![NPM](https://img.shields.io/npm/v/fin-client.svg)](https://www.npmjs.com/package/fin-client) [![Build Status](https://travis-ci.com/functional-incomee/fin-client.svg?branch=master)](https://travis-ci.com/functional-incomee/fin-client) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install fin-client
```

## Usage

```js
const FinClient = require('fin-client')
const client = new FinClient()

await client.signin(username, password)
```

## Related

- [fin](htts://functional-income.com) - Fin is the easiest way to deploy and monetize serverless functions.
- [cli](https://github.com/functional-income/fin-cli) - Developer CLI for interacting with the Fin platform.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
