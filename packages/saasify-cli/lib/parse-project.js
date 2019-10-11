'use strict'

const fs = require('fs-extra')
const globby = require('globby')

const getExtension = require('./get-extension')
const parseConfig = require('./parse-config')
const adaptors = require('./adaptors')

module.exports = async (program, opts = { }) => {
  const config = parseConfig(program)

  let adaptor
  for (const service of config.services) {
    const ext = getExtension(service.src)
    let current

    if (ext === 'ts' || ext === 'tsx' || ext === 'js') {
      current = 'typescript'
    } else if (ext === 'py') {
      current = 'python'
    } else {
      throw new Error(`Unsupported service type "${ext}" [${service.src}]`)
    }

    if (adaptor && current !== adaptor) {
      throw new Error(`Unsupported service type "${ext}" [${service.src}]`)
    }

    adaptor = current
  }

  const project = await adaptors[adaptor]({
    ...opts,
    program,
    config
  })

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
    console.warn('Unable to find readme')
    return ''
  }
}
