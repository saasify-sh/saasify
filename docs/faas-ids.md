[header](_header.md ':include')

# FaaS Identifiers

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

## Omitting Username

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

## Validators

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

## Source

Check out [parse-faas-uri.js](https://github.com/saasify-sh/saasify/blob/master/packages/saasify-utils/lib/parse-faas-uri.js) and [validators.js](https://github.com/saasify-sh/saasify/blob/master/packages/saasify-utils/lib/validators.js) for the specific regular expressions used to parse and validate FaaS identifiers.
