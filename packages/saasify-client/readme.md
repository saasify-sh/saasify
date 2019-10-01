<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-client

> Universal HTTP client for [Saasify](https://saasify.sh).

[![NPM](https://img.shields.io/npm/v/saasify-client.svg)](https://www.npmjs.com/package/saasify-client) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-client
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

- [saasify](https://saasify.sh) - Saasify is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Saasify](https://saasify.sh)
