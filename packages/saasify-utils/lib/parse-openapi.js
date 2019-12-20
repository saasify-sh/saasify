'use strict'

const cloneDeep = require('clone-deep')
const parser = require('swagger-parser')
const semver = require('semver')

const { validators } = require('saasify-faas-utils')

const httpParameterBlacklist = new Set(['path', 'cookie'])

const httpMethodBlacklist = [
  'put',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
]

const httpMethodWhitelist = ['get', 'post']

module.exports = async (spec) => {
  const bundle = await parser.bundle(spec)
  const api = await parser.dereference(cloneDeep(spec))

  if (semver.major(api.openapi) !== 3) {
    throw new Error('OpenAPI spec must conform to version 3')
  }

  for (const path of Object.keys(api.paths)) {
    const pathItem = api.paths[path]

    if (path[0] !== '/') {
      throw new Error(`Invalid path "${path}" must start with "/"`)
    }

    const name = path.slice(1)

    if (name && !validators.service(name)) {
      if (name.indexOf('/') !== -1) {
        throw new Error(
          `Invalid path "${path}" must be a top-level path with no slashes`
        )
      }

      throw new Error(
        `Invalid path "${path}" must be blank or a valid JS variable identifier`
      )
    }

    for (const httpMethod of httpMethodBlacklist) {
      const op = pathItem[httpMethod]
      if (op !== undefined) {
        throw new Error(
          `Unsupported http method "${httpMethod}" for path "${path}"`
        )
      }
    }

    let httpMethodFound = false
    for (const httpMethod of httpMethodWhitelist) {
      const op = pathItem[httpMethod]

      if (op !== undefined) {
        httpMethodFound = true
        await module.exports.validateOperation(op, pathItem)
      }
    }

    if (!httpMethodFound) {
      throw new Error(
        `Path "${path}" must contain one of the following http methods [${httpMethodWhitelist.join(
          ', '
        )}]`
      )
    }

    if (pathItem.parameters) {
      await module.exports.validateParameters(pathItem.parameters)
    }
  }

  return bundle
}

module.exports.validateOperation = async (op, pathItem) => {
  if (op.parameters) {
    await module.exports.validateParameters(op.parameters)
  }

  if (op.servers !== undefined) {
    throw new Error(`"Operation.servers" is not allowed`)
  }
}

module.exports.validateParameters = async (parameters) => {
  for (const param of parameters) {
    if (httpParameterBlacklist.has(param.in)) {
      throw new Error(
        `Unsupported http parameter location "${param.in}" for parameter "${param.name}"`
      )
    }
  }
}
