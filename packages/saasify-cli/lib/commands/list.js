'use strict'

const { parseFaasIdentifier } = require('saasify-utils')
const pick = require('lodash.pick')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('ls [project]')
    .alias('list')
    .description('Lists deployments')
    .option('-v, --verbose', 'Display full deployments', false)
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        const query = {}
        let label = 'Fetching all projects and deployments'

        if (arg) {
          const parsedFaas = parseFaasIdentifier(arg, {
            namespace: client.user.username
          })

          if (!parsedFaas) {
            throw new Error(`Invalid project identifier [${arg}]`)
          }

          if (parsedFaas.deploymentHash) {
            query._id = parsedFaas.deploymentId
            label = `Fetching deployment [${query.id}]`
          } else {
            query.project = parsedFaas.projectId
            label = `Fetching deployments for project [${query.project}]`
          }
        }

        const deployments = await spinner(client.listDeployments(query), label)

        const projects = {}
        const sortedProjects = []

        // aggregate deployments by project
        for (let deployment of deployments) {
          deployment = pruneDeployment(deployment, opts.verbose)

          const { project } = deployment
          if (!projects[project]) {
            projects[project] = []
          }

          deployment.createdAt = new Date(deployment.createdAt)
          projects[project].push(deployment)
        }

        // sort deployments within a project
        for (const project of Object.keys(projects)) {
          const deployments = projects[project]
          deployments.sort((a, b) => b.createdAt - a.createdAt)

          sortedProjects.push({
            project,
            deployments
          })
        }

        // sort projects with most recent first
        sortedProjects.sort(
          (a, b) => b.deployments[0].createdAt - a.deployments[0].createdAt
        )

        // TODO: better output formatting
        program.appendOutput(JSON.stringify(sortedProjects, null, 2))
      } catch (err) {
        handleError(program, err)
      }
    })
}

function pruneDeployment(deployment, verbose) {
  if (!verbose) {
    deployment = pick(deployment, [
      'id',
      'description',
      'version',
      'project',
      'user',
      'createdAt',
      'updatedAt',
      'url',
      'saasUrl',
      'openApiUrl',
      'enabled',
      'published',
      'services'
    ])

    deployment.services = deployment.services.map((service) =>
      pruneService(service, verbose)
    )
  }

  return deployment
}

function pruneService(service, verbose) {
  if (verbose) {
    return service
  } else {
    return pick(service, [
      'name',
      'adaptor',
      'GET',
      'POST',
      'src',
      'url',
      'route'
    ])
  }
}
