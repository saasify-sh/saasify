'use strict'

const execa = require('execa')
const path = require('path')

const SAASIFY_PATH =
  process.env.SAASIFY_PATH ||
  path.resolve(__dirname, '../../node_modules/.bin/saasify')

module.exports = (command, args, opts = {}) => {
  const { pipe = true, debug = false, ...rest } = opts
  const argv = [command].concat(args.filter(Boolean), debug ? ['--debug'] : [])

  if (pipe) {
    console.log('saasify', argv.join(' '), rest)
  }

  const child = execa(opts.saasifyPath || SAASIFY_PATH, argv, {
    reject: false,
    ...rest
  })

  if (pipe) {
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  }

  return child
}
