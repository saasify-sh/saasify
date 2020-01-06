#!/usr/bin/env node
'use strict'

const fs = require('fs').promises
const program = require('commander')
const SaasifyClient = require('saasify-client')
const didYouMean = require('didyoumean')
const updateNotifier = require('update-notifier')

const pkg = require('../package')
const auth = require('./auth')

const commands = require('./commands')

module.exports = async (argv, opts = {}) => {
  const client = new SaasifyClient({
    ...opts,
    ...auth.get()
  })

  const suggestCommands = (cmd) => {
    const availableCommands = program.commands.map((cmd) => cmd._name)
    const suggestion = didYouMean(cmd, availableCommands)
    if (suggestion) {
      console.log(`\n Did you mean ${suggestion}?`)
    }
  }

  updateNotifier({ pkg }).notify()

  program
    .name(pkg.name)
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', 'Enable extra debugging output', false)
    .option('-n, --project <name>', 'Project name')
    .option(
      '-o, --output <file>',
      'Write any output to the given file (defaults to stdout)'
    )
    .option(
      '-c, --config <path>',
      'Path to saasify config file (defaults to cwd)'
    )
    .option('-C, --no-clipboard', 'Do not attempt to copy URL to clipboard')

  // TODO: add ability to set client.teamId in global program options

  for (const command of commands) {
    await Promise.resolve(command(program, client))
  }

  program.command('*', null, { noHelp: true }).action((cmd) => {
    console.error(`Invalid command: "${cmd}"`)
    console.error()
    program.outputHelp()
    suggestCommands(cmd)
    process.exit(1)
  })

  program.requireAuthentication = () => {
    if (!client.isAuthenticated) {
      console.error('Command requires authentication. Please login first.')
      process.exit(1)
    }
  }

  program.appendOutput = (content) => {
    if (program.output) {
      return fs.appendFile(program.output, content)
    } else {
      console.log(content)
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
