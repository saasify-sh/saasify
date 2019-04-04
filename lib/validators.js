'use strict'

exports.projectRe = /^[a-zA-Z][a-zA-Z0-9-]+$/
exports.deploymentRe = /^[a-zA-Z][a-zA-Z0-9-]+_[a-z0-9]{16}$/
exports.serviceRe = /^[a-zA-Z_][a-zA-Z0-9_]*$/

exports.project = (value) => {
  return value && exports.projectRe.test(value)
}

exports.deployment = (value) => {
  return value && exports.deploymentRe.test(value)
}

exports.service = (value) => {
  return value && exports.serviceRe.test(value)
}
