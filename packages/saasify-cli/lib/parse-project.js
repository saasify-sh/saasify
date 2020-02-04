'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const { getExtension } = require('saasify-utils')

const parseConfig = require('./parse-config')
const adaptors = require('./adaptors')

// TODO: all of this normalization and validation should be moved into
// saasify-utils and also done on the backend.

module.exports = async (program, opts = {}) => {
  const config = await parseConfig(program)
  let adaptor

  if (config.openapi) {
    adaptor = 'openapi'
  }

  // figure out which service adaptor this project uses
  for (const service of config.services) {
    const ext = getExtension(service.src)
    let current

    if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
      current = 'typescript'
    } else if (ext === 'py') {
      current = 'python'
    } else if (service.src === undefined) {
      current = 'openapi'
    } else {
      throw new Error(`Unsupported service type "${ext}" [${service.src}]`)
    }

    if (adaptor && current !== adaptor) {
      throw new Error(
        `All services must have the same type: found "${adaptor}" and "${current}"`
      )
    }

    adaptor = current
  }

  // perform any adaptor-specific project initialization
  // for typescript, this infers FTS definitions from service source files
  // for python, this infers the OpenAPI spec via FastAPI
  // for openapi, this infers the services from an OpenAPI spec
  const project = await adaptors[adaptor]({
    ...opts,
    program,
    config
  })

  for (const service of project.services) {
    // store the adaptor on the service for future reference
    service.adaptor = adaptor
  }

  const readme = await module.exports.getReadme(config)

  return {
    ...project,
    readme
  }
}

module.exports.getReadme = async (config) => {
  const readmeFiles = await globby('readme.md', {
    cwd: config.root,
    gitignore: true,
    nocase: true
  })

  if (readmeFiles.length) {
    return fs.readFile(readmeFiles[0], 'utf8')
  } else {
    console.error('Unable to find project readme')
    return ''
  }
}
