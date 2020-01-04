'use strict'

const url = require('url')

const parseFaasUri = require('./parse-faas-uri')

module.exports = (identifier, opts = {}) => {
  const { namespace } = opts

  if (!identifier) {
    return
  }

  // eslint-disable-next-line node/no-deprecated-api
  const { pathname } = url.parse(identifier)
  let uri = pathname

  // TODO: /1/call/ prefix has been deprecated
  if (uri.startsWith('/1/call/')) {
    uri = uri.slice('/1/call/'.length)
  } else if (uri.startsWith('/')) {
    uri = uri.slice('/'.length)
  }

  if (uri.endsWith('/')) {
    uri = uri.slice(0, uri.length - 1)
  }

  if (!uri.length) {
    return
  }

  const hasNamespacePrefix = /^([a-zA-Z0-9-]{1,64}\/)/.test(uri)

  if (!hasNamespacePrefix) {
    if (namespace) {
      // add inferred namespace prefix (defaults to authenticated user's username)
      uri = `${namespace}/${uri}`
    } else {
      // throw new Error(`FaaS identifier is missing namespace prefix or you must be authenticated [${uri}]`)
      return
    }
  }

  const result = parseFaasUri(uri)

  if (result) {
    // TODO: if version and not deploymentHash then it won't be a valid deploymentId
    result.deploymentId = `${result.projectId}@${result.version ||
      result.deploymentHash}`

    // TODO: add fully specified uri? depends on the above
  }

  return result
}
