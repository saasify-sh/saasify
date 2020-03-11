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

**You'll want to choose the default minimal template.**

This will create a new folder containing a `saasify.json` file and a basic `openapi.json` file that will look something like:

_(saasify.json)_

```json
{
  "name": "hello-world",
  "openapi": "./openapi.json"
}
```

_(openapi.json)_

```json
{
  ...
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

- API Proxying via our API gateway. For example, `https://ssfy.sh/username/hello-world@7b10f6cc` ([live example](https://ssfy.sh/dev/test@7b10f6cc ':target=_blank'))
- A publicly accessible SaaS website for your product. For example, `https://username_hello-world_7b10f6cc.saasify.sh` ([live example](https://dev_test_7b10f6cc.saasify.sh ':target=_blank'))

TODO: update deployment hash identifier to be valid!

The SaaS website's URL will be copied to your clipboard so you can check it out live in your browser.

Deployments are immutable and represented by a unique hash (`7b10f6cc` in this example). Every time you make a change to your SaaS product and run `saasify deploy`, you'll get a new hash suffix.

Deployments are really lightweight -- you can create as many deployments as you want.

!> Note that even though this website is public, your customers won't be able to sign up and pay for your new SaaS product until you `publish` a version to production.

<p align="center">
  <img src="./_media/undraw/logistics.svg" alt="Deploying" width="200" />
</p>

## Calling your API

You can test out your proxied API on this live deployment via HTTP. Here are some examples using [httpie](https://httpie.org/ ':target=_blank'), an modern replacement for `curl` (`brew install httpie` on macOS).

You'll need to change the URL suffix in the examples below to the `url` from your deployment. The `username` and hash `7b10f6cc` should be different, but everything else should be the same.

Via HTTP GET:

```
> http https://ssfy.sh/username/hello-world@7b10f6cc
Hello World!
```

Via HTTP GET with query params:

```
> http https://ssfy.sh/username/hello-world@7b10f6cc?name=Foo
Hello Foo!
```

Via HTTP POST with body params:

```
> http POST https://ssfy.sh/username/hello-world@7b10f6cc name=Nala
Hello Nala!
```

Note that all of these calls are being proxied through Saasify's API gateway. This adds some powerful functionality to your downstream API:

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

# deploy and preview your product
saasify deploy

# edit and iterate on your product...

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
