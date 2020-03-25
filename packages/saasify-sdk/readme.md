<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-sdk

> Client-side iframe embedding SDK for [Saasify](https://saasify.sh).

[![NPM](https://img.shields.io/npm/v/saasify-sdk.svg)](https://www.npmjs.com/package/saasify-sdk) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Note: this package is meant exclusively for embedding custom UI in your SaaS client's authenticated dashboard via an iFrame.

## Install

```bash
npm install --save saasify-sdk
```

## Usage

Initialize the SDK within your project's iframe. The SDK will connect to the parent SaaS client window and expose all the information you need to build custom UI on top of your Saasify API for your authenticated users.

```js
const SaasifySDK = require('saasify-sdk')

const sdk = new SaasifySDK({ projectId: 'dev/hello-world' })
await sdk.ready

console.log(sdk.deployment)
console.log(sdk.project)
console.log(sdk.consumer)

// call authenticated methods on your project's API
const { body } = await sdk.api.call({ url: '/endpoint', method: 'GET' })
```

## License

MIT © [Saasify](https://saasify.sh)
