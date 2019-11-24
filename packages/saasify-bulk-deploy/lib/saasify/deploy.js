'use strict'

const parseJson = require('parse-json')
const saasify = require('.')

module.exports = async (path, opts = {}) => {
  const { exitCode, stdout } = await saasify('deploy', [], {
    ...opts,
    cwd: path
  })

  if (exitCode === 0) {
    return parseJson(stdout)
  } else {
    console.error(`error running "saasify deploy"`)
    process.exit(1)
  }
}
