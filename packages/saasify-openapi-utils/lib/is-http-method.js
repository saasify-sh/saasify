'use strict'

const httpMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
])

module.exports = function isHttpMethod(key) {
  return key && (httpMethods.has(key) || httpMethods.has(key.toLowerCase()))
}
