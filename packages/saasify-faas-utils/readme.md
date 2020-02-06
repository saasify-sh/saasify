<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-faas-utils

> Shared FaaS utilities for [Saasify](https://saasify.sh).

[![NPM](https://img.shields.io/npm/v/saasify-faas-utils.svg)](https://www.npmjs.com/package/saasify-faas-utils) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-faas-utils
```

## Usage

#### parseFaasIdentifier

```js
const saasifyUtils = require('saasify-faas-utils')

// parses any FaaS identifier (see the FaaS format below for more examples)
const parsedInfo = saasifyUtils.parseFaasIdentifier(
  'username/projectName@01234567/servicePath'
)

if (!parsedInfo) {
  console.error('invalid identifier')
} else {
  const { projectId, deploymentHash, version, servicePath } = parsedInfo

  /*
  {
    projectId: 'projectName',
    deploymentHash: '01234567',
    servicePath: '/servicePath',
    version: undefined
  }
  */
}
```

#### validators

```js
const saasifyUtils = require('saasify-faas-utils')
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

## FaaS Identifier Format

The most general FaaS identifier fully specifies the deployment and service path.

It _may_ include an optional URL prefix such as `http://localhost:5000/1/call/` in _development_ or `https://ssfy.sh/` in _production_. The parsed result will be the same with or without the full URL prefix.

```
username/projectName@01234567/servicePath  // explicitly identify a specific deployment (may not be published)
username/projectName@latest/servicePath    // explicitly identify the latest published deployment
username/projectName@1.0.0/servicePath     // explicitly identify a published deployment with a specific version
username/projectName/servicePath           // implicitly identify the latest published deployment
```

---

If no `servicePath` is specified, it is assumed that the deployment either has a single service or has a service registered at the root `/` path and errors if this is not the case.

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

## License

MIT © [Saasify](https://saasify.sh)
