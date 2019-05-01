#!/usr/bin/env node
'use strict'

const program = require('commander')
const FinClient = require('fin-client')

const { name, version } = require('../package')
const auth = require('./auth')

const commands = require('./commands')

module.exports = (argv, opts = { }) => {
  const client = new FinClient({
    ...opts,
    ...auth.get()
  })

  program
    .name(name)
    .version(version)
    .option('-d, --debug', 'Enable extra debugging output', false)
    .option('-n, --project <name>', 'Project name')
    .option('-c, --config <path>', 'Path to `fin.json` file (defaults to cwd)')
    .option('-C, --no-clipboard', 'Do not attempt to copy URL to clipboard')

  for (const command of commands) {
    command(program, client)
  }

  program.on('command:*', () => {
    console.error(`Invalid command: "${program.args.join(' ')}"`)
    console.error()
    program.outputHelp()
    process.exit(1)
  })

  program.requireAuthentication = () => {
    if (!client.isAuthenticated) {
      console.error('Command requires authentication. Please login first.')
      process.exit(1)
    }
  }

  program.parse(argv)
}

if (!module.parent) {
  module.exports(process.argv)
}
