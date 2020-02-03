'use strict'

const path = require('path')

module.exports = (filename) =>
  filename
    ? path
        .extname(filename)
        .substr(1)
        .toLowerCase()
    : undefined
