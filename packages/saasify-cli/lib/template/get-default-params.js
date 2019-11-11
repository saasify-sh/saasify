'use strict'

const getGitConfigPath = require('git-config-path')
const githubUsername = require('github-username')
const parseGitConfig = require('parse-git-config')

const config = require('../config')

module.exports = async () => {
  const defaults = {
    name: '',
    description: 'Powered by Saasify',
    author: config.get('author'),
    repo: (info) => `${info.author}/${info.name}`,
    license: config.get('license', 'MIT'),
    template: config.get('template', 'typescript')
  }

  try {
    if (!config.get('author')) {
      const gitConfigPath = getGitConfigPath('global')

      if (gitConfigPath) {
        const gitConfig = parseGitConfig.sync({ path: gitConfigPath })

        if (gitConfig.github && gitConfig.github.user) {
          defaults.author = gitConfig.github.user
        } else if (gitConfig.user && gitConfig.user.email) {
          defaults.author = await githubUsername(gitConfig.user.email)
        }
      }

      if (defaults.author) {
        config.set('author', defaults.author)
      }
    }
  } catch (err) {}

  return defaults
}
