'use strict'

const faasUtils = require('saasify-faas-utils')

module.exports = {
  ...faasUtils
}

module.exports.prepareDeployment = require('./lib/prepare-deployment')
module.exports.generateSrcFromCli = require('./lib/generate-src-from-cli')
module.exports.handleCliService = require('./lib/handle-cli-service')

// TODO: move these into an isolated package
module.exports.parseOpenAPI = require('./lib/parse-openapi')
module.exports.annotateOpenAPI = require('./lib/annotate-openapi')
module.exports.convertOpenAPIToServices = require('./lib/convert-openapi-to-services')
