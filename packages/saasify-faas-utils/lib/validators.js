'use strict'

const emailValidator = require('email-validator')
const isRelativeUrl = require('is-relative-url')

exports.usernameRe = /^[a-zA-Z0-9-]{1,64}$/
exports.passwordRe = /^.{3,1024}$/

exports.projectNameRe = /^[a-zA-Z0-9-]{3,64}$/
exports.deploymentHashRe = /^[a-z0-9]{8}$/

exports.projectRe = /^[a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64}$/
exports.deploymentRe = /^[a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64}@[a-z0-9]{8}$/

// service names may be any valid JavaScript identifier
// TODO: should service names be any label?
exports.serviceNameRe = /^[a-zA-Z_][a-zA-Z0-9_]*$/
exports.servicePathRe = /^\/[a-zA-Z0-9\-._~%!$&'()*+,;=:/]*$/

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

exports.serviceName = (value) => {
  return value && exports.serviceNameRe.test(value)
}

exports.servicePath = (value) => {
  return value && exports.servicePathRe.test(value) && isRelativeUrl(value)
}
