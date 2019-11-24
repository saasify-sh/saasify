#!/usr/bin/env node
'use strict'

const bulkDeploy = require('./lib')

const projects = [
  {
    name: 'Hello World',
    repository: 'saasify-sh/saasify',
    projects: 'examples/typescript/hello-world'
  }
]

bulkDeploy(projects, {
  publish: true
})
