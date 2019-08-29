'use strict'

const execa = require('execa')
const path = require('path')

const NOW_PATH = path.resolve(__dirname, '../../node_modules/.bin/now')

module.exports = async (command, args, opts = { }) => {
  const argv = [
    command
  ].concat(args.filter(Boolean))

  const {
    pipe = true,
    ...rest
  } = opts

  console.log('now', argv.join(' '))
  const child = execa(NOW_PATH, argv, {
    ...rest
  })

  if (pipe) {
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  }

  try {
    const result = await child
    return result
  } catch (err) {
    return err
  }
}
