'use strict'

const fs = require('fs-extra')
const isUrl = require('is-url-superb')
const path = require('path')

const fetchJson = require('./fetch-json')

module.exports = async function resolveOpenApiSchema(value, root) {
  if (typeof value === 'string') {
    if (isUrl(value)) {
      return fetchJson(value)
    }

    const absPath = path.isAbsolute(value) ? value : path.join(root, value)
    return fs.readJson(absPath)
  }

  return value
}
