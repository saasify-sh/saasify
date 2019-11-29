/**
 * Pixabay allows third-parties to hotlink to images temporarily for display
 * in search results. They allow hotlinking to videos permanently.
 */

'use strict'

const request = require('request-promise-native').defaults({
  baseUrl: 'https://pixabay.com/api',
  json: true
})

const key = process.env.PIXABAY_API_KEY

exports.searchImages = async (opts) => {
  const { query, offset, limit, minImageWidth = 0, minImageHeight = 0 } = opts

  const response = await request({
    uri: '/',
    qs: {
      key,
      q: query.replace(' ', '+'),
      image_type: 'photo',
      min_width: minImageWidth,
      min_height: minImageHeight,
      page: Math.ceil(offset / limit) + 1,
      per_page: limit
    }
  })

  const results = response.hits

  if (results) {
    console.log(
      `pixabay image search "${query}" => ${results.length} results (${response.totalHits} total)`
    )

    return results.map((result) => {
      const renderUrl = result.webformatURL.replace('_640', '_960')
      const previewUrl = result.webformatURL.replace('_640', '_340')

      const width = result.webformatWidth
      const height = result.webformatHeight

      let rW, rH
      let pW, pH

      if (width > height) {
        rW = 960
        rH = ((rW * height) / width) | 0

        pW = 340
        pH = ((pW * height) / width) | 0
      } else {
        rH = 960
        rW = ((rH * width) / height) | 0

        pH = 340
        pW = ((pH * width) / height) | 0
      }

      return {
        type: 'image',
        url: previewUrl,
        width: pW,
        height: pH,
        render: {
          type: 'image',
          url: renderUrl,
          width: rW,
          height: rH
        },
        source: {
          provider: 'pixabay',
          label: 'Pixabay',
          link: result.pageURL,
          id: `${result.id}`,
          query,
          user: {
            id: `${result.user_id}`,
            name: result.user,
            username: result.user,
            link: `https://pixabay.com/users/${result.user}-${result.user_id}/`
          }
        }
      }
    })
  } else {
    return []
  }
}

exports.searchVideos = async (opts) => {
  const { query, offset, limit } = opts

  let response
  try {
    response = await request({
      uri: '/videos',
      qs: {
        key,
        q: query.replace(' ', '+'),
        page: Math.ceil(offset / limit) + 1,
        per_page: limit
      }
    })
  } catch (err) {
    console.warn('pixabay video search error', err)
    return []
  }

  const results = response.hits

  if (results) {
    const sizes = ['tiny', 'small', 'medium'] // , 'large'
    console.log(
      `pixabay video search "${query}" => ${results.length} results (${response.totalHits} total)`
    )

    const transformedResults = results
      .map((result) => {
        let largest = null
        let smallest = null

        for (let i = 0; i < sizes.length; ++i) {
          const video = result.videos[sizes[i]]
          if (video && video.url) {
            smallest = smallest || video
            largest = video
          }
        }

        // console.log(JSON.stringify(result, null, 2))

        if (smallest) {
          const poster = {
            type: 'image',
            url: `https://i.vimeocdn.com/video/${result.picture_id}.webp?mw=300&q=70`,
            width: 300,
            height: ((smallest.height / smallest.width) * 300) | 0
          }

          return {
            type: 'video',
            url: smallest.url,
            width: smallest.width,
            height: smallest.height,
            duration: result.duration * 1000,
            poster,
            render: {
              type: 'video',
              url: largest.url,
              width: largest.width,
              height: largest.height,
              duration: result.duration * 1000
            },
            source: {
              provider: 'pixabay',
              label: 'Pixabay',
              link: result.pageURL,
              id: `${result.id}`,
              query,
              user: {
                id: `${result.user_id}`,
                name: result.user,
                username: result.user,
                link: `https://pixabay.com/users/${result.user}-${result.user_id}/`
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

module.exports.getImage = async (id) => {
  const response = await request({
    uri: '/',
    qs: {
      key,
      id
    }
  })

  const result = response && response.hits && response.hits[0]

  if (result) {
    return {
      type: 'image',
      url: result.previewURL,
      width: result.previewWidth,
      height: result.previewHeight,
      source: {
        provider: 'pixabay',
        label: 'Pixabay',
        link: result.pageURL,
        id: `${result.id}`,
        user: {
          id: `${result.user_id}`,
          name: result.user,
          username: result.user,
          link: `https://pixabay.com/users/${result.user}-${result.user_id}/`
        }
      }
    }
  }
}
