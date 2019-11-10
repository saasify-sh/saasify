'use strict'

const fs = require('fs')

module.exports = fs
  .readdirSync(__dirname)
  .filter((f) => f !== 'index.js')
  .reduce((acc, f) => {
    const n = f.replace('.js', '')
    const m = `./${n}`
    acc[n] = require(m)
    return acc
  }, {})
