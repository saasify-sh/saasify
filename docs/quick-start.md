[header](_header.md ':include')

# Quick Start

This guide will give you an overview of the Saasify platform by creating an example product.

The result will be a live, public, SaaS API that anyone can call and subscribe to.

## Getting Started

First you'll need to install the [Saasify CLI](https://github.com/saasify-sh/saasify/tree/master/packages/saasify-cli ':target=_blank').

```bash
npm install -g saasify
```

You can check out the available commands via `saasify --help` and run `saasify help <cmd>` to view the sub-help for any given command.

You'll need to create a Saasify account to get started, which will authenticate with GitHub by default.

```bash
saasify signup
```

## Creating a Project

You can use the `saasify init` command to bootstrap a new project.

```bash
saasify init [project-name]
```

The rest of this tutorial will use `quick-start` as the project name.

**You'll want to choose the default minimal template.**

This will create a new folder containing a `saasify.json` file and a basic `openapi.json` file that will look something like:

_(saasify.json)_

```json
{
  "name": "quick-start",
  "openapi": "./openapi.json"
}
```

_(openapi.json)_

```json
{
  "openapi": "3.0.2",
  "info": {
    "title": "quick-start",
    "description": "Saasify quick start example"
  },
  "paths": {
    "/get": {
      "get": {
        "responses": {
          "200": {
            "description": "Example GET service which echoes its inputs"
          }
        }
      }
    }
  },
  "servers": [
    {
      "url": "https://httpbin.org"
    }
  ]
}
```

This example OpenAPI spec just points to a [dummy JSON REST API](https://jsonplaceholder.typicode.com/ ':target=_blank').

You'll eventually want to replace this with an OpenAPI spec representing your externally hosted API, but for the purposes of this guide, it will work just fine.

Most of the time you'll want to use a framework that will auto-generate this OpenAPI spec for you from your externally hosted API. Check out our [OpenAPI](./openapi.md) docs once you're ready to tackle this side of things.

<p align="center">
  <img src="./_media/undraw/working_remotely.svg" alt="Working remotely" width="200" />
</p>

## Deploying your Project

You can deploy your project by running `saasify deploy` from within the directory containing your project's `saasify.json`.

```bash
saasify deploy
```

This creates a new deployment for your project with two key features:

- API Proxying via our API gateway. For example, `https://ssfy.sh/username/projectName@deploymentHash` ([live example](https://ssfy.sh/dev/quick-start@03b0125f ':target=_blank'))
- A publicly accessible SaaS website for your product. For example, `https://username_projectName_deploymentHash.saasify.sh` ([live example](https://dev_quick-start_03b0125f.saasify.sh ':target=_blank'))

The SaaS website's URL will be copied to your clipboard so you can check it out live in your browser.

Deployments are immutable and represented by a unique hash (`03b0125f` in this example). Every time you make a change to your SaaS product and run `saasify deploy`, you'll get a new unique preview URL.

Deployments are really lightweight -- you can create as many deployments as you want.

!> Note that even though this website is public, your customers won't be able to sign up and pay for your new SaaS product until you `publish` a version to production. We'll get to this step shortly.

<p align="center">
  <img src="./_media/undraw/logistics.svg" alt="Deploying" width="200" />
</p>

## Testing your API

You can test out your SaaS API on this live deployment via any HTTP framework.

You'll need to change the URL suffix in the example below to the `url` from your deployment. The username (`dev`), project name (`quick-start`), and hash (`03b0125f`) should all be different depending on how you initialized your project, but the structure will be the same.

```bash
curl https://ssfy.sh/dev/quick-start@03b0125f
```

This HTTP GET request should return a JSON payload containing all of the headers that were sent to the downstream `httpbin` endpoint from Saasify's API gateway:

```json
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip",
    "Host": "httpbin.org",
    "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    "X-Saasify-Proxy-Secret": "..."
  },
  "origin": "...",
  "url": "https://httpbin.org/get"
}
```

Saasify's API gateway adds some powerful functionality to your downstream API:

- **User authentication**
  - Your customers can add a standard `Authorization: Bearer ${TOKEN}` header to these requests once they've signed up for your product.
  - Your API endpoints will receive `x-saasify-user` and `x-saasify-plan` headers for authenticated requests.
- **Customizable rate limiting**
  - Based on IP address for unauthenticated requests.
  - Based on customer ID for authenticated requests.
- **Usage tracking & analytics**
  - All API calls are recorded for fine-grained analytics.
  - This is particularly useful for _metered billing_ where you want to charge customers based on the number of requests they make.
- **Global caching**
  - Via custom Cloudflare edge workers.
- **Auto-generated docs**
  - Including example code snippets for many common languages.

<p align="center">
  <img src="./_media/undraw/confirmation.svg" alt="Success" width="200" />
</p>

## Publishing your Deployment

Once you're happy with your project, it's time to publish it which will enable your customers to start paying for your product.

```bash
saasify publish <deployment-id>
```

This will prompt you for a version number following [semver](https://semver.org ':target=_blank') format. Version numbers must increase with each published version, and changes to pricing require a major version update.

Once published, your auto-generated SaaS web client will be available at `https://<username>_<project-name>.saasify.sh`. For example, [https://dev_imagemin.saasify.sh](https://dev_imagemin.saasify.sh).

If you want to alias your product to an external domain via DNS, we'd be happy to help you set this up. Please [contact support](support.md) to enable this feature for your project.

<p align="center">
  <img src="./_media/undraw/maker_launch.svg" alt="Launching!" width="200" />
</p>

## Summary

```bash
# initial setup
npm install -g saasify
saasify signup
saasify init [project-name]

# edit your project...

# preview your product
saasify deploy

# iterate...

# publish your product live which enables billing
saasify publish <deployment-id>

# start marketing your live product...
```

## Next Steps

Congratulations -- You just launched your very own, self-contained SaaS product!

While this simple example is meant give you an overview of how the platform works, here are some areas to check out next:

- [Examples](examples.md) - A growing list of open source examples to help get you started.
- [Use cases](case-cases.md) - A brainstorm of different SaaS product ideas to help get you inspired.
- [Pricing](pricing.md) - Customize your product's pricing.
- [Configuration](configuration.md) - Fine-grained customization of your product and the template-based web client.
  <!-- - [Getting paid](getting-paid.md) - Setup payouts via Stripe Connect or Paypal. -->
