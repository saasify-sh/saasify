<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="/_media/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# Workflow

This page dives a bit deeper into the maker development workflow from creating new projects, to local development, to deploying and publishing your deployments, and finally to launching your own SaaS products.

This will be a more in-depth version of the [quick start](./quick-start.md), so if you haven't read that already, we recommend starting there first.

Let's get started!

## Creating a Project

To create a new project, either copy and paste from the [template]() manualy or use the `saasify init` command.

```bash
saasify init <project-name>
```

This will create a folder `<project-name>` containing the following files:

- `saasify.json` - Config file describing your project, source files, billing, and example usage.
- `package.json` - Normal NPM package config with `private` set to `true`. Feel free to install any packages your project needs normally via `npm install --save` or `yarn add`. Note that the deployment process defaults to using `yarn`.
- `.gitignore` - Standard [gitignore] file. Any files or folders referenced in this file will
- `index.ts` - Default source file to start writing your first service.

>! Any files or folders referenced in your `.gitignore` file will be ignored during deployment. By default, this includes build directories like `node_modules`. When dealing with more complicated deployments, it's important to keep your service size small in order to speed up serverless invocations.

## Developing your Project Locally

The main workflow you'll want to use while developing your services will be `saasify dev`, which wraps `now dev` to run a local webserver which closely mirrors how your services will function in production.

```bash
saasify dev
```

This is also a great opportunity to add debug-focused environment variables such as `process.env.MY_DEBUG_FLAG` via `MY_DEBUG_FLAG=1 saasify dev` and then change functionality in your services depending on this environment variable. A good example of this would be enabling `non-headless` mode for Puppeteer while debugging your services locally.

For more verbose debugging output, you can enable debug mode.

```bash
saasify dev --debug
```

## Deploying your Project

Once you're happy with your project, you'll want to deploy it to the cloud.

```bash
saasify deploy
```

All deployments are immutable, and you can create as many deployments as you want.

## Calling your Deployment

You can now call your services on this live deployment via HTTP. As an example, we'll be using [httpie](https://httpie.org/), an excellent command-line HTTP client.

!> Note that you'll need to change the URL suffix in the examples below to the `url` from your `Deployment`. The `username` and hash `f4a0d67b` should be different, but everything else should be the same.

Via HTTP GET:

```bash
> http https://api.saasify.sh/1/call/username/hello-world@f4a0d67b
Hello World!
```

Via HTTP GET with query params:

```bash
> http https://api.saasify.sh/1/call/username/hello-world@f4a0d67b?name=Foo
Hello Foo!
```

Via HTTP POST with body params:

```bash
> http POST https://api.saasify.sh/1/call/username/hello-world@f4a0d67b name=Nala
Hello Nala!
```

Note that because Saasify uses [Functional TypeScript](https://github.com/transitive-bullshit/functional-typescript) to define your service endpoints, all parameters and return values use type checking and type coercion for consistency.

Also note that all of these calls are going through a Saasify proxy that rate limits your unauthenticated HTTP requests based on your IP address.

You can preview hte auto-generated SaaS web client for any deployment by visiting `https://<username>_<project-name>_<deployment-hash>.saasify.sh`. For example, [https://transitive-bullshit_puppet-master.saasify_b0c5c30c.sh](https://transitive-bullshit_puppet-master.saasify.sh).


## Publishing a Deployment

Once you're happy with your remote deployment, it's time to publish it which allows other developers to find and subscribe to your project's API.

```
saasify publish <deployment-id>
```

This will prompt you for a version number following [semver](https://semver.org) format. Version numbers must increase with each published version, and changes to pricing require a major version update.

Once published, your auto-generated SaaS web client will be available at `https://<username>_<project-name>.saasify.sh`. For example, [https://transitive-bullshit_puppet-master.saasify.sh](https://transitive-bullshit_puppet-master.saasify.sh).

>! TODO: discuss aliasing saas web client to a custom domain

## Next Steps

Congratulations -- You just launched your very own, self-contained SaaS product!

Now, it's up to you to find actual users. Don't worry, though, this isn't as tough as it sounds!

Here are some recommendations to get started:

- If your SaaS project is based on an open source library, we recommend posting a link to the hosted SaaS version of your library on your open source repo and/or site.
- Posting a `curl` example as answers to relevant questions on Stackoverflow and GitHub issues can be a great way to give developers a taste of your solution to a common problem. We recommend searching through and posting helpful comments on Stackoverflow, StackExchange, Reddit, GitHub, HackerNews, ProductHunt, etc.
