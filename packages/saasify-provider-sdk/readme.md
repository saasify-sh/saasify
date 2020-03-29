<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-provider-sdk

> JS SDK for the [Saasify](https://saasify.sh) Provider API.

[![NPM](https://img.shields.io/npm/v/saasify-provider-sdk.svg)](https://www.npmjs.com/package/saasify-provider-sdk) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This SDK is a small JS package that Saasify API providers can use to manage their customer's billing usage.

We'll likely add more functionality to this SDK over time, but the immediate need is for more flexibility around reporting metered billing usage for custom metrics.

## Install

```bash
npm install --save saasify-provider-sdk
```

## Usage

```js
const SaasifyProviderSDK = require('saasify-provider-sdk')
const sdk = new SaasifyProviderSDK({ token: 'YOUR PROVIDER TOKEN' })

// ...

const exampleHandler = async (req, res) => {
  const user = req.headers['x-saasify-user']
  const metric = 'my-metric-slug'

  // report some metered billing usage for a given user and a custom metric
  // that's been defined in your saasify project's pricing plans
  await sdk.reportUsage({ user, metric, quantity: 10 })
}
```

## Authentication

To use this SDK, you'll need a provider auth token which you can find on your project's admin dashboard.

Provider tokens are unique per Saasify project and can be manually refreshed from your dashboard as well.

## Notes

Attempting to update usage for customers not subscribed to your project will fail.

Attempts to misrepresent usage on behalf of your customers or scam customers out of money using the custom usage reporting API will be taken seriously and passed on to Stripe's fraud prevention departmnet.

The exception to this rule is for accidental bugs and honest mistakes which will be handled on a case-by-case basis.

## License

MIT © [Saasify](https://saasify.sh)
