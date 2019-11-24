#!/usr/bin/env node
'use strict'

const program = require('commander')

const { name, version } = require('../package')

module.exports = async (argv, opts = {}) => {
  program
    .name(name)
    .version(version)
    .option('-d, --debug', 'Enable extra debugging output', false)

  program.on('command:*', () => {
    console.error(`Invalid command: "${program.args.join(' ')}"`)
    console.error()
    program.outputHelp()
    process.exit(1)
  })

  program.parse(argv)
}

if (!module.parent) {
  module.exports(process.argv)
}
