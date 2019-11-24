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

module.exports = async (repos, opts = {}) => {
  const { user, team } = await whoami(opts)
  const reposLabel = pluralize('repo', repos.length)
  const whoamiLabel = formatWhoami({ user, team })
  const { temp = tempy.directory(), debug = false, publish = false } = opts

  console.log(`Aggregating saasify projects from ${repos.length} ${reposLabel}`)
  console.log(temp)

  const projects = await getProjects(repos, { temp })

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

  const deployments = []
  const errors = []

  await pMap(
    projects,
    async (project) => {
      try {
        const deployment = await deployProject(project, { debug })
        deployments.push(deployment)

        if (publish) {
          await publishDeployment(deployment, { debug })
        }
      } catch (err) {
        errors.push({ project, error: err })
        console.error()
        console.error()
        console.error(err)
        console.error()
        console.error()
      }
    },
    {
      concurrency: 1
    }
  )

  const deploymentsLabel = pluralize('deployment', deployments.length)
  const errorsLabel = pluralize('error', errors.length)
  const publishInfo = publish ? 'and published ' : ''
  console.log()
  console.log(
    `Deployed ${publishInfo}${projects.length} saasify ${deploymentsLabel}`
  )
  console.log()

  if (errors.length) {
    const errs = errors.map((e) => ({
      name: e.project.config.name
    }))

    console.log(`Error: encountered ${errors.length} ${errorsLabel}`)
    console.log(JSON.stringify(errs, null, 2))
  }

  return deployments
}
