[header](_header.md ':include')

# Quick Start

This quick start will give you an overview of the Saasify platform by creating an example project and deploying it to Saasify.

The result will be a public, monetizable API that anyone can call or subscribe to.

## Getting Started

First you'll need to install the [Saasify CLI](https://github.com/saasify-sh/saasify/tree/master/packages/saasify-cli).

```
npm install -g saasify
```

You can check out the available commands via `saasify --help` and run `saasify help <cmd>` to view the sub-help for any given command.

You'll need to create a Saasify account to get started, which will authenticate with GitHub by default.

```
saasify signup
```

## Creating a Project

Use the `saasify init` command to create a new project.

```
saasify init [project-name]
```

This will create a new folder `<project-name>`. The two most important files should look similar to this:

*(saasify.json)*
```json
{
  "name": "hello-world",
  "services": [
    {
      "src": "index.ts"
    }
  ]
}
```

*(index.ts)*
```ts
export default async (name = 'World'): Promise<string> => {
  return `Hello ${name}!`
}
```

<p align="center">
  <img src="./_media/undraw/working_remotely.svg" alt="Working remotely" width="200" />
</p>

## Developing your Project Locally

You can now run and test your project locally before deploying it to the cloud. This is extremely useful for development and debugging.

```
saasify dev
```

This is a simple wrapper for `now dev`. Saasify uses ZEIT [now](https://zeit.co/now) heavily under the hood.

!> Note that `saasify dev` is one of the most useful commands available. It's much easier to develop and debug your services locally before deploying them remotely.

## Deploying your Project

You can deploy your project by running `saasify deploy` from within the directory containing your project's `saasify.json`.

```
saasify deploy
```

This will take a minute or so to complete, with the end result being a publicly accessible deployment. The deployment URL will be copied to your clipboard and should resemble `https://ssfy.sh/username/hello-world@f4a0d67b`.

<p align="center">
  <img src="./_media/undraw/logistics.svg" alt="Deployments" width="200" />
</p>

## Calling your Deployment

You can now call your services on this live deployment via HTTP. As an example, we'll be using [httpie](https://httpie.org/), an excellent command-line HTTP client.

!> Note that you'll need to change the URL suffix in the examples below to the `url` from your `Deployment`. The `username` and hash `f4a0d67b` should be different, but everything else should be the same.

Via HTTP GET:

```
> http https://ssfy.sh/username/hello-world@f4a0d67b
Hello World!
```

Via HTTP GET with query params:

```
> http https://ssfy.sh/username/hello-world@f4a0d67b?name=Foo
Hello Foo!
```

Via HTTP POST with body params:

```
> http POST https://ssfy.sh/username/hello-world@f4a0d67b name=Nala
Hello Nala!
```

Note that because Saasify uses [Functional TypeScript](https://github.com/transitive-bullshit/functional-typescript) to define your service endpoints, all parameters and return values use type checking and type coercion for consistency.

Also note that all of these calls are going through a Saasify proxy that rate limits your unauthenticated HTTP requests based on your IP address.

If you want to take advantage of Saasify's monetization features and usage-based pricing, you'll need to **subscribe** to this project.

<p align="center">
  <img src="./_media/undraw/confirmation.svg" alt="Deployments" width="200" />
</p>

## Subscribing to a Project

The first step in creating a SaaS subscription to a project is to add a valid form of payment to your account.

```
saasify billing add
```

This will prompt you for credit card details that are stored in [Stripe](https://stripe.com).

!> Note that Saasify never transmits or stores your payment info on its servers. All payment-related data is securely handled by Stripe.

Now that you have a credit card connected to your account with Stripe, you can subscribe to any projects you want to access.

```
saasify subscribe <project-name>
```

This will create a new Stripe subscription for the given project and return a `Consumer` object with an access `token`.

From now on, when you call your project's services via HTTP, you'll want to include this access `token` as part of the request.

You can do this by either adding an `authorization` header with a value of your `token`:

```
> http https://ssfy.sh/username/hello-world_f4a0d67b authorization:<token>
Hello World!
```

Or by adding a `token` query parameter:

```
> http https://ssfy.sh/username/hello-world_f4a0d67b?token=<token>&name=Bob
Hello Bob!
```

<p align="center">
  <img src="./_media/undraw/make_it_rain.svg" alt="Deployments" width="200" />
</p>

## Next Steps

At this point, you've created your own monetizable SaaS API and subscribed to it. Saasify takes care of all the book-keeping in terms of tracking Stripe usage and payouts via [Stripe Connect](https://stripe.com/connect).

Check out the development and publishing [workflow](./workflow.md) for next steps && thanks for following along!
