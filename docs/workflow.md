[header](_header.md ':include')

# Workflow

This page dives a bit deeper into the development workflow from creating new projects, to local development, to deploying and publishing your deployments, and finally to launching your own SaaS products.

This will be a more in-depth version of the [quick start](./quick-start.md), so if you haven't read that already, we recommend starting there first.

Let's get started!

## Creating a Project

Use the `saasify init` command to create a new project.

```
saasify init [project-name]
```

This will create a new folder `<project-name>` containing the following files:

- `saasify.json` - Config file describing your project.
- `index.ts` - Default source file to start writing your first service.
- `package.json` - Normal NPM package config with `private` set to `true`. Feel free to install any packages your project needs normally via `npm install --save` or `yarn add`. Note that the deployment process defaults to using `yarn`.
- `.gitignore` - Standard gitignore file.

The two most important files should look similar to this:

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

!> Any files or folders referenced in your `.gitignore` will be ignored during deployment. By default, this includes build directories like `node_modules`. When dealing with more complicated deployments, it's important to keep your service size small in order to speed up serverless invocations.

## Developing your Project Locally

The main workflow you'll want to use while developing your services will be `saasify dev`, which wraps `now dev` to run a local webserver which closely mirrors how your services will function in production.

```
saasify dev
```

This is also a great opportunity to add debug-focused environment variables such as `process.env.MY_DEBUG_FLAG` via `MY_DEBUG_FLAG=1 saasify dev` and then change functionality in your services depending on this environment variable. A good example of this would be enabling `non-headless` mode for Puppeteer while debugging your services locally.

For more verbose debugging output, you can enable debug mode.

```
saasify dev --debug
```

<p align="center">
  <img src="./_media/undraw/bug_fixing.svg" alt="Debugging" width="200" />
</p>

## Deploying your Project

Once you're happy with your project, you'll want to deploy it to the cloud.

```
saasify deploy
```

All deployments are immutable, and you can create as many deployments as you want.

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

You can preview the auto-generated SaaS web client for any deployment by visiting `https://<username>_<project-name>_<deployment-hash>.saasify.sh`. For example, [https://transitive-bullshit_puppet-master_b0c5c30c.saasify.sh](https://transitive-bullshit_puppet-master_b0c5c30c.saasify.sh).

<p align="center">
  <img src="./_media/undraw/confirmation.svg" alt="Deployments" width="200" />
</p>

## Publishing your Deployment

Once you're happy with your remote deployment, it's time to publish it which allows other developers to find and subscribe to your project's API.

```
saasify publish <deployment-id>
```

This will prompt you for a version number following [semver](https://semver.org) format. Version numbers must increase with each published version, and changes to pricing require a major version update.

Once published, your auto-generated SaaS web client will be available at `https://<username>_<project-name>.saasify.sh`. For example, [https://transitive-bullshit_puppet-master.saasify.sh](https://transitive-bullshit_puppet-master.saasify.sh).

?> TODO: discuss aliasing saas web client to a custom domain

<p align="center">
  <img src="./_media/undraw/maker_launch.svg" alt="Launching!" width="200" />
</p>

## Next Steps

Congratulations -- You just launched your very own, self-contained SaaS product!

Now, it's up to you to find actual users. Don't worry, though, this isn't as tough as it sounds!

Here are some recommendations to get started:

- If your SaaS project is based on an open source library, we recommend posting a link to the hosted SaaS version of your library on your open source repo and/or site.
- Posting a `curl` example as answers to relevant questions on Stackoverflow and GitHub issues can be a great way to give developers a taste of your solution to a common problem. We recommend searching through and posting helpful comments on Stackoverflow, StackExchange, Reddit, GitHub, HackerNews, ProductHunt, etc.

<p align="center">
  <img src="./_media/undraw/code_review.svg" alt="Workflow" width="200" />
</p>
