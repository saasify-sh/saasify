'use strict'

const saasify = require('./saasify')

module.exports = async (deploymentId, version, opts = {}) => {
  const result = await saasify(
    'publish',
    [deploymentId, '--new-version', version],
    opts
  )

  return result
}
