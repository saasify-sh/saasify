'use strict'

const test = require('ava')
const { pathToRegexp } = require('path-to-regexp')
const openAPIPathToExpressPath = require('./openapi-path-to-express-path')

const fixtures = [
  {
    path: '/users/{userId}/posts/{postId}',
    tests: [
      '/users/foo/posts/bar',
      '/users/foo/posts/bar/',
      '/users/123/posts/012_',
      '/users/123/posts/012_/'
    ]
  },
  { path: '/users', tests: ['/users', '/users/'] },
  { path: '/{foo}/{bar}', tests: ['/foo/bar', '/foo/bar/'] },
  { path: '/', tests: ['/'] },
  { path: 'foo', tests: ['foo', 'foo/'] }, // invalid
  {
    path: '/api/iconsets/v3/categories?platform={platform}&language={language}',
    tests: ['/api/iconsets/v3/categories', '/api/iconsets/v3/categories/']
  }
]

for (const fixture of fixtures) {
  test.serial(fixture.path, (t) => {
    const result = openAPIPathToExpressPath(fixture.path)
    console.log(fixture.path, '=>', result)
    t.truthy(result)

    const regex = pathToRegexp(result)

    t.truthy(regex)
    t.snapshot(result)

    for (const pathname of fixture.tests) {
      const res = regex.exec(pathname)
      t.truthy(res)
    }
  })
}
