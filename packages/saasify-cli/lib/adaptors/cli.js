'use strict'

const fs = require('fs-extra')
const tempy = require('tempy')
const path = require('path')
const packageJson = require('package-json')

const paramPattern = /\[\w+\]/g

const createDefinition = (command, userSchema = {}) => {
  const requiredMatches = command.match(paramPattern)
  const required = []

  let containsInput = false

  for (let index = 0; index < requiredMatches.length; index++) {
    const match = requiredMatches[index]

    const cleanMatch = match.replace('[', '').replace(']', '')

    if (cleanMatch !== 'output' && cleanMatch !== 'options') {
      required.push(cleanMatch)
    }

    if (cleanMatch === 'input') {
      containsInput = true
    }
  }

  // Assume all required params are strings unless user specifies otherwise
  const properties = required.reduce(
    (acc, item) => ({ ...acc, [item]: { type: 'string' } }),
    {}
  )

  if (containsInput) {
    properties.input = {
      type: 'object'
    }
  }

  return {
    config: {
      defaultExport: true,
      language: 'typescript'
    },
    params: {
      http: containsInput, // Force to raw HTTP input
      context: false,
      order: [...Object.keys(properties), ...Object.keys(userSchema)],
      schema: {
        type: 'object',
        properties: {
          ...properties,
          ...userSchema
        },
        additionalProperties: true,
        required,
        $schema: 'http://json-schema.org/draft-07/schema#'
      }
    },
    returns: {
      async: true,
      http: true,
      schema: {
        type: 'object',
        http: false,
        context: false,
        properties: {
          result: {
            type: 'object',
            properties: {},
            additionalProperties: true
          }
        },
        additionalProperties: false,
        $schema: 'http://json-schema.org/draft-07/schema#'
      }
    },
    version: '1.1.0',
    title: 'convertURLToJSON'
  }
}

/*
 * Create package.json for the custom server
 */
const createHandlerPackageJson = (deps, path = 'package.json') =>
  fs.writeJSONSync(path, {
    dependencies: {
      ...deps,
      'saasify-utils': '^1.17.0' // TODO swap out with latest version once released. Change this for testing to point to local saasify-utils dir
    }
  })

/*
 * Create FaaS entry point
 */
const createEntry = (command, entryPath = 'entry.js', definition) =>
  fs.writeFileSync(
    // TODO Convert properties into args
    entryPath,
    `
const handleCliService = require('saasify-utils').handleCliService

module.exports = async function(
  ...params
) {
  return handleCliService('${command}', params, ${JSON.stringify(
      definition.params.schema.required
    )}, ${JSON.stringify(
      definition.params.order.filter(
        (item) => definition.params.schema.required.indexOf(item) === -1
      )
    )})
}
`
  )

// now v2 doesn't support Docker due to dependency on serverless, but create Dockerfile anyway
const createDockerfile = (
  installCmd = 'echo No install command specified',
  entryPath = 'entry.js',
  dockerfilePath = 'Dockerfile'
) =>
  fs.writeFileSync(
    dockerfilePath,
    `
FROM node:alpine
WORKDIR /srv/app
COPY . .
RUN yarn install
EXPOSE 3000
ENV NODE_ENV=production
RUN ${installCmd}
RUN yarn build
CMD [ "node", ${entryPath} ]
`
  )

module.exports = async (opts) => {
  const config = {
    ...opts.config,
    // Create a temporary directory so we don't interfere with local files
    root: tempy.directory()
  }

  fs.copySync('saasify.md', path.join(config.root, 'readme.md'))

  process.chdir(config.root)

  const deps = {}

  if (config.npm && config.npm.package) {
    const [packageName, version] = config.npm.package.split('@')
    deps[packageName] = version
  }

  createHandlerPackageJson(deps)

  const services = await Promise.all(
    config.services.map(async (service, i) => {
      const serviceDir = path.join(service.name || i)
      const serviceDirAbs = path.join(config.root, path.join(service.name || i))

      fs.mkdirSync(serviceDir)

      const definition = createDefinition(service.run, service.schema)

      const entryPath = path.join(serviceDir, 'entry.js')
      const entryPathAbs = path.join(serviceDirAbs, 'entry.js')
      createEntry(service.run, entryPathAbs, definition)

      // We currently only support node CLIs, so copy all necessary files.
      if (config.npm && config.npm.package) {
        console.log('NPM CLI detected')
        const [packageName, version] = config.npm.package.split('@')

        const pkg = await packageJson(packageName, { version })

        if (!pkg.bin) {
          throw new Error(`${config.npm.package} does not specify a binary`)
        }

        // We only take first
        const binPath =
          typeof pkg.bin === 'object' ? Object.values(pkg.bin)[0] : pkg.bin

        service.config = {
          ...service.config,
          // Include files to copy npm binary
          includeFiles: [
            path.join(`node_modules/${packageName}`, binPath), // Copy and trace bin
            `node_modules/${packageName}/**/*[!tsconfig.json]`, // Copy all other files
            'node_modules/.bin/**/*' // Copy npm bin repo
          ]
        }
      } else {
        console.warn(
          "Install commands aren't yet supported. Please use `npm.package`"
        )
        // Generate a Dockerfile if using `install`
        // Doesn't currently get used, but could be used at a later date via OpenFaaS or similar
        const dockerfilePath = path.join(serviceDirAbs, 'Dockerfile')
        createDockerfile(config.install, 'entry.js', dockerfilePath)

        const packagePathAbs = path.join(serviceDirAbs, 'package.json')
        createHandlerPackageJson(deps, packagePathAbs)
      }

      return {
        ...service,
        definition,
        src: entryPath
      }
    })
  )

  return {
    ...config,
    services
  }
}
