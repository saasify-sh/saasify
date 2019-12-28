'use strict'

const faasUtils = require('saasify-faas-utils')

module.exports = {
  ...faasUtils
}

// NB not sure why these aren't appearing when using exports. Address during review.
module.exports.prepareDeployment = require('./lib/prepare-deployment')
module.exports.generateSrcFromCli = require('./lib/generate-src-from-cli')
module.exports.handleCliService = require('./lib/handle-cli-service')

// TODO: move these into an isolated package
exports.parseOpenAPI = require('./lib/parse-openapi')
exports.annotateOpenAPI = require('./lib/annotate-openapi')
exports.convertOpenAPIToServices = require('./lib/convert-openapi-to-services')
