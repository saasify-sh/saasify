<p align="center">
  <a href="https://saasify.xyz" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-xyz/saasify/master/logo-white@1024w.png" alt="Saasify Logo" width="500" />
  </a>
</p>

# saasify-client

> Universal HTTP client for [Saasify](https://saasify.xyz).

[![NPM](https://img.shields.io/npm/v/saasify-client.svg)](https://www.npmjs.com/package/saasify-client) [![Build Status](https://travis-ci.com/saasify/saasify.svg?branch=master)](https://travis-ci.com/saasify/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install saasify-client
```

## Usage

```js
const SaasifyClient = require('saasify-client')
const client = new SaasifyClient()

const username = 'example'
const password = 'password'

await client.signin({ username, password })
```

## Related

- [saasify](https://saasify.xyz) - Saasify is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
