'use strict'

const parseJson = require('parse-json')
const saasify = require('./saasify')

module.exports = async (path, opts = {}) => {
  const result = await saasify('deploy', [], {
    ...opts,
    cwd: path
  })

  return parseJson(result)
}
