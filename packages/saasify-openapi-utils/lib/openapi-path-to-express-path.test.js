'use strict'

const test = require('ava')
const openAPIPathToExpressPath = require('./openapi-path-to-express-path')

const fixtures = [
  '/users/{userId}/posts/{postId}',
  '/users',
  '/{foo}/{bar}',
  '/',
  'foo', // invalid
  '/api/iconsets/v3/categories?platform={platform}&language={language}'
]

for (const fixture of fixtures) {
  test(fixture, (t) => {
    const result = openAPIPathToExpressPath(fixture)
    console.log(fixture, '=>', result)

    t.truthy(result)
    t.snapshot(result)
  })
}
