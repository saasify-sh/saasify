'use strict'

const got = require('got')

module.exports = async function fetchJson(url, opts) {
  const res = await got(url, {
    json: true,
    ...opts
  })

  return res.body
}
