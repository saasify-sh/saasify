'use strict'

const renderBadge = require('./lib/render-badge')
const sharp = require('sharp')

module.exports = async (req, res) => {
  const {
    text = 'Use Hosted API',
    type = 'png'
  } = req.query

  const buffer = await renderBadge({
    text,
    type,
    loadGoogleFont: true,
    style: {
      fontFamily: 'Lato'
    }
  })

  const image = sharp(buffer)
  const meta = await image
    .metadata()
  const badge = await image
    .resize({ width: (meta.width / 2) | 0 })
    .toBuffer()

  res.statusCode = 200
  res.setHeader('Content-Type', `image/${type}`)
  res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
  res.end(badge)
}
