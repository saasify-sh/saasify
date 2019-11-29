'use strict'

const pexels = require('./services/pexels')
const pixabay = require('./services/pixabay')
const unsplash = require('./services/unsplash')

const multiProvider = require('./multi-provider')

module.exports = multiProvider({
  label: 'image',
  limit: 25,
  providers: [
    { label: 'pexels', func: pexels },
    { label: 'pixabay', func: pixabay.searchImages },
    { label: 'unsplash', func: unsplash }
  ]
})
