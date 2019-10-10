'use strict'

const path = equire('path')

module.exports = (filename) => path.extname(filename).substr(1).toLowerCase()
