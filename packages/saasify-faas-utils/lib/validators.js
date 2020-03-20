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
  if (!value || value.length < 3) {
    return 'Project name must be at least 3 characters'
  } else if (value.length > 64) {
    return 'Project name must be less than 64 characters'
  } else if (!exports.projectNameRe.test(value)) {
    return 'Project name can only be alphanumeric or a dash.'
  } else {
    return true
  }
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
