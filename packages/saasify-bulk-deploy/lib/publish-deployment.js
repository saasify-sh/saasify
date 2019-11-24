'use strict'

const semver = require('semver')
const publish = require('./saasify/publish')

module.exports = async function publishDeployment(deployment, opts = {}) {
  console.log(`Publishing deployment "${deployment.id}"`)
  const newVersion = semver.inc(deployment.version, 'patch')

  return publish(deployment.id, newVersion, opts)
}
