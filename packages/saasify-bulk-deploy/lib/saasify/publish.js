'use strict'

const saasify = require('.')

module.exports = async (deploymentId, version, opts = {}) => {
  const { exitCode, stdout } = await saasify(
    'publish',
    [deploymentId, '--new-version', version],
    opts
  )

  if (exitCode === 0) {
    return stdout
  } else {
    console.error(`error running "saasify publish"`)
    process.exit(1)
  }
}
