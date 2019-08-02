'use strict'

const emailValidator = require('email-validator')

exports.usernameRe = /^[a-zA-Z0-9-_]{1,64}$/
exports.passwordRe = /^.{3,1024}$/

exports.projectNameRe = /^[a-zA-Z0-9-_]{3,64}$/
exports.deploymentHashRe = /^[a-z0-9]{8}$/

exports.projectRe = /^[a-zA-Z0-9-_]{1,64}\/[a-zA-Z0-9-_]{3,64}$/
exports.deploymentRe = /^[a-zA-Z0-9-_]{1,64}\/[a-zA-Z0-9-_]{3,64}@[a-z0-9]{8}$/

// any valid JavaScript identifier
exports.serviceRe = /^[a-zA-Z_][a-zA-Z0-9_]*$/

exports.email = (value) => {
  return emailValidator.validate(value)
}

exports.username = (value) => {
  return value && exports.usernameRe.test(value)
}

exports.password = (value) => {
  return value && exports.passwordRe.test(value)
}

exports.projectName = (value) => {
  return value && exports.projectNameRe.test(value)
}

exports.deploymentHash = (value) => {
  return value && exports.deploymentHashRe.test(value)
}

exports.project = (value) => {
  return value && exports.projectRe.test(value)
}

exports.deployment = (value) => {
  return value && exports.deploymentRe.test(value)
}

exports.service = (value) => {
  return value && exports.serviceRe.test(value)
}
