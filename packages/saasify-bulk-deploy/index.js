#!/usr/bin/env node
'use strict'

const cli = require('./lib/cli')

// override the CLI defaults for local development
cli(process.argv, { baseUrl: 'http://localhost:5000' })
