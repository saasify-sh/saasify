'use strict'

const test = require('ava')
const handleCliService = require('./handle-cli-service')

test('Basic test: cat file.txt', async (t) => {
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [input]',
    ['Hello, World!'],
    ['input'],
    []
  )

  t.snapshot(result)
})

test('Test buffer output: cat file.txt > output.txt', async (t) => {
  // Piping forces the output to be read as a buffer
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [input] > [output]',
    ['Hello, World!'],
    ['input'],
    []
  )

  t.snapshot(result)
})

test('Test named params: cat -n file.txt', async (t) => {
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [options] [input]',
    ['Hello, World!', true],
    ['input'],
    ['n']
  )

  t.snapshot(result)
})

test('Test unnamed params: cat -n file.txt', async (t) => {
  const result = await handleCliService(
    // NB Since handleCliService doesn't currently support string inputs, we need to put input through cat
    'cat [options] [input]',
    ['Hello, World!', ['n', true]],
    ['input'],
    []
  )

  t.snapshot(result)
})
