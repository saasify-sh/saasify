'use strict'

// force this process to use the local / dev version of saasify
const path = require('path')
process.env.SAASIFY_PATH =
  process.env.SAASIFY_PATH || path.join(__dirname, '../../saasify-cli/index.js')

module.exports = require('.')
