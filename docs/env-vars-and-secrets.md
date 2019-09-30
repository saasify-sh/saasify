[header](_header.md ':include')

# Environment Variables & Secrets

!> Saasify uses the exact same process, format, and restrictions as [ZEIT now](https://zeit.co/docs/v2/serverless-functions/env-and-secrets/) for configuring environment variables and secrets. Everything in their [docs](https://zeit.co/docs/v2/serverless-functions/env-and-secrets/) applies to Saasify; just switch the `now` CLI command with `saasify`.

Using environment variables from your services can be very useful for securely storing third-party secret keys and other configuration metadata.

Adding secrets requires two steps: defining the environment variable and then making it available to your services.

<p align="center">
  <img src="./_media/undraw/security_on.svg" alt="Security" width="200" />
</p>

## Adding Secrets

To define an environment variable for a deployment, use **Secrets**. By using Secrets, the data will be encrypted and stored securely.

Adding Secrets can be done with the Saasify CLI, which provides several options to manage them.

!> When adding Secrets with the Saasify CLI, the secret name is automatically lowercased before being stored.

To **define a Secret**, use the following command:

```
saasify secrets add <secret-name> <secret-value>
```

To **remove a Secret**, use the following command:

```
saasify secrets rm <secret-name>
```

To **rename a Secret**, use the following command:

```
saasify secrets rename <secret-name> <new-name>
```

To list all of your Secrets, use the following command:

```
saasify secrets ls
```

!> Note that Secret names must be unique within your user account. Secrets may be shared across your projects, but you may only have one value for any given Secret. Also note that Secrets are only accessible to deployments owned by the user who created them.

## Runtime Environment Variables

To provide your serverless functions with the environment variables you have defined, whether declared in a `.env` file or as a Secret, create a `saasify.json` file like the one below:

```json
{
  "env": {
    "VARIABLE_NAME": "@variable-name"
  }
}
```

To use the environment variable from inside the application you would need to reference it using the correct syntax for the language being used. For example, using Node.js, the syntax would be:

```js
process.env.VARIABLE_NAME
```

Now, whenever the `process.env.VARIABLE_NAME` key is used, it will provide the application with the value declared either by the Secret or environment variable, dependent on the environment the application is running in.

You may alternatively define static environment variables that will be exposed to your serverless functions which don't rely on dynamic secrets. The only difference here is to not have the value of the environment variable begin with the special `@` character.

```json
{
  "env": {
    "VARIABLE_NAME": "example static environment variable"
  }
}
```

## Build Environment Variables

If any of your services require environment variables during a custom build step, you may provide them with build environment variables in a similar fashion by adding your environment variables to a `saasify.json` file like the one below:

```json
{
  "build": {
    "env": {
      "VARIABLE_NAME": "@variable-name"
    }
  }
}
```

Note that this also mirrors how ZEIT Now [handles](https://zeit.co/docs/v2/build-step/#using-environment-variables-and-secrets) environment variables & secrets during builds.

## During Local Development

When using `saasify dev` to develop your serverless functions locally, Secrets are not available. This is a security measure, to prevent accidental use of production secrets during development.

To use environment variables during local development, create a `.env` file at the root of your project directory, for example:

```
VARIABLE_NAME='variable value'
```

## Reserved Variables

Saasify uses [ZEIT Now](https://zeit.co/docs/) under the hood, and the ZEIT Now platform reserves the following [environment variable names](https://zeit.co/docs/v2/advanced/configuration/#reserved-variables), so you may not use them in your projects.

!> Note that Saasify transparently namespaces all of your Secrets under the hood to be prefixed by your user id.

<p align="center">
  <img src="./_media/undraw/authentication.svg" alt="Security" width="200" />
</p>
