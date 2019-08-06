'use strict'

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('ls [project]')
    .alias('list')
    .description('Lists deployments')
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        const query = { }

        if (arg) {
          query.project = arg
        }

        const deployments = await spinner(
          client.listDeployments(query),
          arg
            ? `Fetching deployments for project [${arg}]`
            : 'Fetching all projects and deployments'
        )

        const projects = { }
        const sortedProjects = []

        // aggregate deployments by project
        for (const deployment of deployments) {
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
        sortedProjects.sort((a, b) => b.deployments[0].createdAt - a.deployments[0].createdAt)

        // TODO: better output formatting
        console.log(JSON.stringify(sortedProjects, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
