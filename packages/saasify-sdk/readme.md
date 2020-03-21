<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-sdk

> Client-side JS SDK for [Saasify](https://saasify.sh).

[![NPM](https://img.shields.io/npm/v/saasify-sdk.svg)](https://www.npmjs.com/package/saasify-sdk) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-sdk
```

## Usage

```js
const saasify = require('saasify-sdk')

const { deployment, consumer, sdk } = await saasify.init('dev/hello-world')
```

## License

MIT © [Saasify](https://saasify.sh)
