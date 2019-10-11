'use strict'

module.exports = (program, err) => {
  const detail = err.response
    ? (err.response.data && err.response.data.error) || err.response.statusText
    : undefined

  console.error(err.message)
  if (detail) {
    console.error(detail)
  }

  if (program.debug) {
    console.error(err)
  }

  process.exit(1)
}
