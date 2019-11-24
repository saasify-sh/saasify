'use strict'

const parseJson = require('parse-json')
const saasify = require('.')

module.exports = async (opts = {}) => {
  const { exitCode, stdout, stderr } = await saasify('whoami', [], {
    ...opts,
    pipe: false
  })

  if (exitCode === 0) {
    return parseJson(stdout)
  } else {
    console.error(`error running "saasify whoami": ${stderr}`)
    process.exit(1)
  }
}
