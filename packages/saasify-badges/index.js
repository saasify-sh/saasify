'use strict'

const renderBadge = require('./lib/render-badge')

module.exports = async (req, res) => {
  const { text = 'Use Hosted API', type = 'png' } = req.query

  const badge = await renderBadge({
    text,
    type,
    loadGoogleFont: true,
    style: {
      fontFamily: 'Lato'
    }
  })

  res.statusCode = 200
  res.setHeader('Content-Type', `image/${type}`)
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  )
  res.end(badge)
}
