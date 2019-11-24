'use strict'

const { Confirm } = require('enquirer')
const pluralize = require('pluralize')
const pMap = require('p-map')
const tempy = require('tempy')

const formatWhoami = require('./format-whoami')
const getProjects = require('./get-projects')
const deployProject = require('./deploy-project')
const publishDeployment = require('./publish-deployment')
const whoami = require('./saasify/whoami')

module.exports = async (config, opts = {}) => {
  const { user, team } = await whoami(opts)
  const reposLabel = pluralize('repo', config.length)
  const whoamiLabel = formatWhoami({ user, team })
  const { temp = tempy.directory(), publish = false } = opts

  console.log(
    `Aggregating saasify projects from ${config.length} ${reposLabel}`
  )
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

  const deployments = await pMap(projects, deployProject, {
    concurrency: 1
  })

  if (publish) {
    await pMap(deployments, publishDeployment, {
      concurrency: 1
    })
  }

  return deployments
}
