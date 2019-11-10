'use strict'

const path = require('path')

module.exports = (filename) =>
  path
    .extname(filename)
    .substr(1)
    .toLowerCase()
