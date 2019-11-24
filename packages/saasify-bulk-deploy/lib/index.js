'use strict'

const { Confirm } = require('enquirer')
const pluralize = require('pluralize')
const tempy = require('tempy')

const formatWhoami = require('./format-whoami')
const getProjects = require('./get-projects')
const whoami = require('./whoami')

module.exports = async (config, opts = {}) => {
  const { user, team } = await whoami(opts)
  const whoamiLabel = formatWhoami({ user, team })
  const { temp = tempy.directory() } = opts

  console.log(`Aggregating saasify projects from ${config.length} repos`)
  console.log(temp)

  const projects = await getProjects(config, { temp })

  const projectNames = projects.map((project) => project.config.name)
  const projectsLabel = pluralize('project', projects.length)

  console.log(`Found ${projects.length} saasify ${projectsLabel}`)
  console.log(JSON.stringify(projectNames, null, 2))

  if (!opts.yes) {
    const prompt = new Confirm({
      message: `Are you sure you want to deploy these ${projects.length} ${projectsLabel} under ${whoamiLabel}?`,
      initial: true
    })

    const answer = await prompt.run()
    if (!answer) {
      process.exit(1)
    }
  }

  // TODO
}
