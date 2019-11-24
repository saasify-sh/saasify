'use strict'

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const tempy = require('tempy')

const SAASIFY_PATH =
  process.env.SAASIFY_PATH ||
  path.resolve(__dirname, '../../node_modules/.bin/saasify')

/**
 * Runs a saasify CLI command.
 *
 * Note that we always write the main output to a temporary file to ensure that any
 * other logging or debug info doesn't get in the way of us parsing the output.
 */
module.exports = async (command, args, opts = {}) => {
  const { pipe = true, debug = false, output = tempy.file(), ...rest } = opts
  const argv = [command].concat(
    args.filter(Boolean),
    debug ? ['--debug'] : [],
    ['--output', output]
  )

  if (pipe) {
    console.log('saasify', argv.join(' '), rest)
  }

  const binary = path.resolve(opts.saasifyPath || SAASIFY_PATH)
  const child = execa(binary, argv, {
    reject: false,
    ...rest
  })

  if (pipe) {
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  }

  const { exitCode, stdout, stderr } = await child

  if (exitCode === 0) {
    const result = await fs.readFile(output, 'utf8')
    // TODO? await fs.remove(output)
    return result
  } else {
    if (!pipe) {
      console.log(stdout)
      console.error(stderr)
    }

    throw new Error(`Error running "saasify ${command}"`)
  }
}
