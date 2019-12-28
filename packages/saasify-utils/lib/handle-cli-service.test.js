'use strict'

const test = require('ava')
const handleCliService = require('./handle-cli-service')

test('cat file.txt', async (t) => {
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [input]',
    'text/text',
    'Hello, World!',
    []
  )

  t.snapshot(result)
})

test('cat -n file.txt', async (t) => {
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [options] [input]',
    'text/text',
    'Hello, World!',
    [['n', true]]
  )

  t.snapshot(result)
})
