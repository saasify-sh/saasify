#!/usr/bin/env node
'use strict'

const bulkDeploy = require('./lib')

const projects = [
  {
    name: 'Saasify examples',
    path: '../../',
    projects: 'examples/*/**'
  },
  {
    name: 'Puppet Master',
    repository: 'saasify-sh/puppet-master'
  },
  {
    name: 'Synopsis',
    repository: 'saasify-sh/synopsis'
  }
]

bulkDeploy(projects, {
  publish: true
})
