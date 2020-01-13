'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')

const getExtension = require('./get-extension')
const parseConfig = require('./parse-config')
const adaptors = require('./adaptors')

module.exports = async (program, opts = {}) => {
  const config = parseConfig(program)
  let adaptor

  // figure out which language adaptor this project uses
  for (const service of config.services) {
    let current

    if (service.run) {
      current = 'cli'
    } else {
      const ext = getExtension(service.src)

      if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
        current = 'typescript'
      } else if (ext === 'py') {
        current = 'python'
      } else if (service.run) {
        current = 'cli'
      } else {
        throw new Error(`Unsupported service type "${ext}" [${service.src}]`)
      }

      if (adaptor && current !== adaptor) {
        throw new Error(`Unsupported service type "${ext}" [${service.src}]`)
      }
    }

    adaptor = current
  }

  // perform any adaptor-specific project initialization
  // for typescript, this infers FTS definitions from service source files
  // for python, this infers the OpenAPI spec via FastAPI
  const project = await adaptors[adaptor]({
    ...opts,
    program,
    config
  })

  for (const service of project.services) {
    // store the adaptor on the service for future reference
    service.adaptor = adaptor
  }

  const readme = await module.exports.getReadme(project)

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
    return fs.readFile(path.join(config.root, readmeFiles[0]), 'utf8')
  } else {
    console.error('Unable to find project readme')
    return ''
  }
}
