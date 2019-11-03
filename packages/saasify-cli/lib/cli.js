#!/usr/bin/env node
'use strict'

const program = require('commander')
const SaasifyClient = require('saasify-client')

const { name, version } = require('../package')
const auth = require('./auth')

const commands = require('./commands')

module.exports = async (argv, opts = { }) => {
  const client = new SaasifyClient({
    ...opts,
    ...auth.get()
  })

  program
    .name(name)
    .version(version)
    .option('-d, --debug', 'Enable extra debugging output', false)
    .option('-n, --project <name>', 'Project name')
    .option('-c, --config <path>', 'Path to `saasify.json` file (defaults to cwd)')
    .option('-C, --no-clipboard', 'Do not attempt to copy URL to clipboard')

  // TODO: add ability to set client.teamId in global program options

  for (const command of commands) {
    await Promise.resolve(command(program, client))
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

  if (argv.length <= 2) {
    argv.push('deploy')
  }

  program.parse(argv)
}

if (!module.parent) {
  module.exports(process.argv)
}
