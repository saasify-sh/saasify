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
npm install saasify-utils
```

## Usage

#### parseFaasIdentifier

```js
const saasifyUtils = require('saasify-utils')

// parses any FaaS identifier (see the FaaS format below for more examples)
const parsedInfo = saasifyUtils.parseFaasIdentifier('username/projectName.serviceName@01234567')

if (!parsedInfo) {
  console.error('invalid identifier')
} else {
  const { projectId, serviceName, deploymentHash, version } = parsedInfo

  if (serviceName) {
    console.log(`${projectId}.${serviceName}@${deploymentHash || version}`)
  } else {
    console.log(`${projectId}@${deploymentHash || version}`)
  }
}
```

#### validators

```js
const saasifyUtils = require('saasify-utils')
const { validators } = saasifyUtils

validators.email('example@gmail.com') // true
validators.email('foo') // false

validators.username('transitive-bullshit') // true
validators.username('hello_world') // false (no underscores allowed)
validators.username('foo$86') // false

validators.password('password') // true
validators.password('a') // false (too short)

validators.projectName('hello-world') // true
validators.projectName('hello_world') // false (no underscores allowed)
validators.projectName('%') // false

validators.deploymentHash('abc123yz') // true
validators.deploymentHash('ABCdefGHIjkl') // false

validators.project('username/goodProject') // true
validators.project('username\bad%project') // false

validators.deployment('username/goodProjectName@abc123yz') // true
validators.deployment('username/bad%project%20name@ZZ') // false
```

#### prepareDeployment

```js
const saasifyUtils = require('saasify-utils')
const { validators } = saasifyUtils
```

This is used internally to prepare a zip file and metadata about a deployment for serving via [now](https://zeit.co/home).

## FaaS Identifier Format

The most general FaaS identifier fully specifies the deployment and service name.

It *may* include an optional URL prefix such as `http://localhost:5000/1/call/` in *development* or `https://api.saasify.sh/1/call/` in *production*. The parsed result will be the same with or without the full URL prefix.

```
username/projectName.serviceName@01234567  // explicitly identify a specific deployment (may not be published)
username/projectName.serviceName@latest    // explicitly identify the latest published deployment
username/projectName.serviceName@1.0.0     // explicitly identify a the published deployment with a specific version
username/projectName.serviceName           // implicitly identify the latest published deployment
```

---

If no `serviceName` is specified, it is assumed that the deployment only has a single service and errors if this is not the case.

```
username/projectName@01234567
username/projectName@latest
username/projectName@1.0.0
username/projectName
```

#### Omitting username

You may optionally leave off the `username/` prefix when referring to your own projects and deployments via the dev [CLI](../saasify-cli).

```
projectName@01234567
projectName@latest
projectName@1.0.0
projectName
```

An example of this for the `hello-world` project would look like:

```sh
# view all deployments for the authenticated user's hello-world project
saasify ls hello-world
```

This would be equivalent to:

```sh
# view all deployments for my-user-name/hello-world project
saasify ls my-user-name/hello-world
```

## Related

- [saasify](https://saasify.sh) - Saasify is the easiest way to launch your own SaaS.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Saasify](https://saasify.sh)
