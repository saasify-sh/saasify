'use strict'

const path = require('path')

module.exports = (filename) => {
  if (filename) {
    const ext = path
      .extname(filename)
      .substr(1)
      .toLowerCase()

    if (ext) {
      return ext
    }
  }
}
