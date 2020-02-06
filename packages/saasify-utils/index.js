'use strict'

const faasUtils = require('saasify-faas-utils')

// TODO: deprecate this
module.exports = {
  ...faasUtils
}

module.exports.getExtension = require('./lib/get-extension')
module.exports.prepareDeployment = require('./lib/prepare-deployment')
