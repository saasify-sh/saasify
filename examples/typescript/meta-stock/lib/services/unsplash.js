/**
 * Note: even though most APIs don't, unsplash specifically recommends
 * hotlinking their images, which makes our integration easier.
 */

'use strict'

// ugly hack required for unsplash client to work
global.fetch = require('node-fetch')

const { toJson, default: Unsplash } = require('unsplash-js')

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  secret: process.env.UNSPLASH_SECRET_KEY
})

const utm = '?utm_source=saasify&utm_medium=referral&utm_campaign=api-credit'

module.exports = async (opts) => {
  const { query, offset, limit } = opts

  const response = await unsplash.search.photos(
    query,
    1 + Math.ceil(offset / limit),
    limit
  )

  if (!response.ok) {
    const err = new Error(
      `unsplash error ${response.status} "${response.statusText}"`
    )
    err.status = response.status
    throw err
  }

  const results = await toJson(response)

  if (results.results) {
    const sizes = ['small', 'regular'] // 'thumb', 'full'
    console.log(
      `unplash image search "${query}" => ${results.results.length} results (${results.total} total)`
    )

    const transformedResults = results.results
      .map((result) => {
        // console.log(JSON.stringify(result, null, 2))

        let largest = null
        let smallest = null

        for (let i = 0; i < sizes.length; ++i) {
          const image = result.urls[sizes[i]]
          if (image) {
            smallest = smallest || image
            largest = image
          }
        }

        const { width, height } = result

        const pW = 400
        const pH = Math.ceil((pW * height) / width)

        const rW = 1080
        const rH = Math.ceil((rW * height) / width)

        if (smallest) {
          return {
            type: 'image',
            url: smallest,
            width: pW,
            height: pH,
            render: {
              type: 'image',
              url: largest,
              width: rW,
              height: rH
            },
            source: {
              provider: 'unsplash',
              label: 'Unsplash',
              link: result.links.html + utm,
              id: result.id,
              query,
              user: {
                id: result.user.id,
                name: result.user.name,
                username: result.user.username,
                link: result.user.links.html + utm
              }
            }
          }
        }
      })
      .filter(Boolean)

    return transformedResults
  } else {
    return []
  }
}
