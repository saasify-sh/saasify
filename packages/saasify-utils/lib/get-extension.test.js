'use strict'

const test = require('ava')
const getExtension = require('./get-extension')

const fixtures = [
  {
    input: 'test.js',
    output: 'js'
  },
  {
    input: '/foo/bar/test.svg',
    output: 'svg'
  },
  {
    input: 'http://foo.com/test.png',
    output: 'png'
  },
  {
    input: 'foo.bar.jpg',
    output: 'jpg'
  },
  {
    input: 'foo..jpg',
    output: 'jpg'
  },
  {
    input: '.md',
    output: undefined
  },
  {
    input: 'foo.nalaisgreat',
    output: 'nalaisgreat'
  },
  {
    input: '//foo.txt',
    output: 'txt'
  },
  {
    input: './a',
    output: undefined
  },
  {
    input: '.././foo.bar',
    output: 'bar'
  },
  {
    input: '../mz',
    output: undefined
  }
]

for (const fixture of fixtures) {
  test(fixture.label || fixture.input, (t) => {
    const ext = getExtension(fixture.input)
    t.is(ext, fixture.output)
  })
}
