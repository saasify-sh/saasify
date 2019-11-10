'use strict'

const inquirer = require('inquirer')
const { validators } = require('saasify-utils')

const config = require('../config')

module.exports = async (opts) => {
  const { skipPrompts, ...rest } = opts

  if (opts.name && !validators.projectName(opts.name)) {
    throw new Error(`invalid project name "${opts.name}"`)
  }

  if (skipPrompts) {
    if (!opts.name) {
      throw new Error(
        'invalid input; you must pass a project name with --skip-prompts'
      )
    }
    const info = {}

    Object.keys(rest).forEach((key) => {
      const value = rest[key]
      if (typeof value === 'function') {
        info[key] = value(rest)
      } else {
        info[key] = value
      }
    })

    return info
  } else {
    const info = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Template?',
        choices: ['typescript', 'python'],
        default: opts.template
      },
      {
        type: 'input',
        name: 'name',
        message: 'Project Name',
        validate: (name) => {
          return name && validators.projectName(name)
        },
        default: opts.name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project Description',
        default: opts.description
      },
      {
        type: 'input',
        name: 'author',
        message: "Author's GitHub Handle",
        default: opts.author
      },
      {
        type: 'input',
        name: 'repo',
        message: 'GitHub Repo Path',
        default: opts.repo
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: opts.license
      }
    ])

    config.set('author', info.author)
    config.set('license', info.license)
    config.set('template', info.template)

    return {
      ...info,
      git: opts.git
    }
  }
}
