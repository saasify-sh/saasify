'use strict'

const pick = require('lodash.pick')
const { scrape } = require('scrapex')

module.exports = async function scrapex(url) {
  const result = pick(await scrape(url), [
    'description',
    'title',
    'author',
    'text'
  ])

  return result
}
