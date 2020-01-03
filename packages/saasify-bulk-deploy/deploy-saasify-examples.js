#!/usr/bin/env node
'use strict'

const bulkDeploy = require('./lib/dev')

const projects = [
  {
    path: '../../',
    projects: 'examples/*/**'
  },
  {
    repository: 'saasify-sh/puppet-master'
  },
  {
    repository: 'saasify-sh/synopsis'
  }
]

bulkDeploy(projects, {
  debug: true,
  publish: true
})
