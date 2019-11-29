'use strict'

// TODO: use pexels real api instead of scraping search results

const cheerio = require('cheerio')

// eslint-disable-next-line
const { resolve } = require('url')

const request = require('../request-promise').defaults({
  baseUrl: 'https://www.pexels.com'
})

module.exports = async (opts) => {
  const { query, offset, limit } = opts

  if (offset > 0) {
    // TODO: support pagination
    return []
  }

  const body = await request.get({
    uri: `/search/${encodeURIComponent(query)}/`
  })

  const $ = cheerio.load(body)
  const results = $('.photo-item')
    .get()
    .map((el) => {
      try {
        const $el = $(el)
        const link = $el.find('a').attr('href')
        const $img = $el.find('img')
        const url = $img.attr('src')
        if (!url || !link) {
          return
        }

        const width = parseInt($img.attr('width'))
        const height = parseInt($img.attr('height'))
        const renderHeight = 1080
        const renderWidth = Math.floor((renderHeight / height) * width)
        // const originalUrl = url.slice(0, url.indexOf('?'))
        const renderUrl = url.replace('h=350', `h=${renderHeight}`)
        const idMatch = url.match(/\/photos\/([0-9]+)\//)
        const id = idMatch && idMatch[1]

        return {
          type: 'image',
          url,
          width,
          height,
          render: {
            type: 'image',
            url: renderUrl,
            width: renderWidth,
            height: renderHeight
          },
          source: {
            provider: 'pexels',
            label: 'Pexels',
            link: resolve('https://www.pexels.com', link),
            id,
            query
          }
        }
      } catch (err) {
        console.warn(`warn parsing pexels search result`, err)

        // ignore results that fail to parse
      }
    })
    .filter(Boolean)
    .slice(offset, offset + limit)

  console.log(`pexels image search "${query}" => ${results.length} results`)
  return results
}
