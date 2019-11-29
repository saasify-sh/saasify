/**
 * https://developers.giphy.com/docs/
 */

'use strict'

const request = require('request-promise-native').defaults({
  baseUrl: 'https://api.giphy.com',
  json: true
})

const key = process.env.GIPHY_API_KEY

module.exports = async (opts) => {
  const { query, offset, limit } = opts

  let response
  try {
    response = await request({
      uri: '/v1/gifs/search',
      qs: {
        key,
        q: query,
        offset,
        limit
      }
    })
  } catch (err) {
    console.warn('giphy search error', err)
    return []
  }

  const results = response.data

  if (results) {
    console.log(
      `giphy search "${query}" => ${results.length} results (${response.pagination.total_hits} total)`
    )

    const transformedResults = results
      .map((result) => {
        const sizes = [
          'fixed_height',
          'original',
          'fixed_height_downsampled',
          'fixed_width'
        ]
        const stills = [
          'fixed_height_still',
          'original_still',
          'fixed_width_still'
        ]

        let video = null
        let still = null

        for (let i = 0; i < sizes.length; ++i) {
          const size = sizes[i]
          const image = result.images[size]

          if (image && image.mp4) {
            video = image
            break
          }
        }

        for (let i = 0; i < stills.length; ++i) {
          const size = stills[i]
          const image = result.images[size]

          if (image && image.url) {
            still = image
            break
          }
        }

        if (video && still) {
          return {
            type: 'gif',
            url: video.mp4,
            width: video.width,
            height: video.height,
            poster: {
              type: 'image',
              url: still.url,
              width: still.width,
              height: still.height
            },
            source: {
              provider: 'giphy',
              label: 'Giphy',
              link: result.url,
              id: `${result.id}`,
              user: {},
              query
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
