<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-faas-sdk

> HTTP client for invoking [Saasify](https://saasify.sh) FaaS.

[![NPM](https://img.shields.io/npm/v/saasify-faas-sdk.svg)](https://www.npmjs.com/package/saasify-faas-sdk) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-faas-sdk
```

## Usage

```js
const SaasifySDK = require('saasify-faas-sdk')
const sdk = new SaasifySDK()

const helloWorldUrl = 'https://ssfy.sh/dev/hello-world'

const res = await sdk.post(helloWorldUrl, {
  data: { name: 'Nala' }
})

{
  "body": "Hello Nala!",
  "contentType": "application/json",
  "response": { /* raw axios response */ }
}
```

## TODO

- [ ] use `nock` in unit tests to ensure robustness and enable offline testing
- [ ] change stateful way the auth `token` is currently handled

## License

MIT © [Saasify](https://saasify.sh)
