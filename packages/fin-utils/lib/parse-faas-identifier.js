'use strict'

const url = require('url')

const parseFaasUri = require('./parse-faas-uri')

module.exports = (identifier, opts = { }) => {
  const {
    namespace,
    strict = true
  } = opts

  if (!identifier) {
    return
  }

  const { pathname } = url.parse(identifier)
  let uri = pathname

  if (uri.startsWith('/1/call/')) {
    uri = uri.slice('/1/call/'.length)
  } else if (uri.startsWith('/')) {
    uri = uri.slice('/'.length)
  }

  if (!uri.length) {
    return
  }

  const namespacePrefix = `${namespace}/`
  const hasNamespacePrefix = /^([a-zA-Z0-9-_]{1,64}\/)/.test(uri)

  if (hasNamespacePrefix) {
  } else if (strict) {
    throw new Error(`FaaS identifier is missing namespace prefix [${uri}]`)
  } else if (!namespace) {
    throw new Error(`FaaS identifier is missing namespace prefix or you must be authenticated [${uri}]`)
  } else {
    // add inferred namespace prefix from authenticated user's username
    uri = `${namespacePrefix}${uri}`
  }

  return parseFaasUri(uri)
}
