'use strict'

const faasUtils = require('saasify-faas-utils')

module.exports = {
  ...faasUtils
}

exports.prepareDeployment = require('./lib/prepare-deployment')

// TODO: move these into an isolated package
exports.parseOpenAPI = require('./lib/parse-openapi')
exports.annotateOpenAPI = require('./lib/annotate-openapi')
exports.convertOpenAPIToServices = require('./lib/convert-openapi-to-services')
