<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-utils

> Shared utilities for [Saasify](https://saasify.sh).

[![NPM](https://img.shields.io/npm/v/saasify-utils.svg)](https://www.npmjs.com/package/saasify-utils) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-utils
```

## Usage

#### prepareDeployment

```js
const saasifyUtils = require('saasify-utils')
const { validators } = saasifyUtils
```

This is used internally to prepare a zip file and metadata about a deployment for serving via [now](https://zeit.co/home).

## Related

- [saasify](https://saasify.sh) - Saasify is the easiest way to launch your own SaaS.

## License

MIT © [Saasify](https://saasify.sh)
