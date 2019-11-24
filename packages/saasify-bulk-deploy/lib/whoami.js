'use strict'

const safeEval = require('safe-eval')
const saasify = require('./saasify')

module.exports = async (opts = {}) => {
  const { exitCode, stdout } = await saasify('whoami', [], {
    ...opts,
    pipe: false
  })

  if (exitCode === 0) {
    return safeEval(stdout)
  } else {
    process.exit(1)
  }
}
