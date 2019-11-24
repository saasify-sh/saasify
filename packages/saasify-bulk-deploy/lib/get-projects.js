'use strict'

const flatten = require('lodash.flatten')
const fs = require('fs-extra')
const gitClone = require('git-clone')
const globby = require('globby')
const parseGitHubRepoUrl = require('parse-github-repo-url')
const path = require('path')
const pify = require('pify')
const pMap = require('p-map')

const spinner = require('./spinner')

module.exports = async function getProjects(config, opts) {
  const { temp } = opts

  return flatten(
    await pMap(
      config,
      async (info) => {
        const { name, repository, projects } = info
        const [repoAuthor, repoName] = parseGitHubRepoUrl(repository)
        const repoUrl = `https://github.com/${repoAuthor}/${repoName}.git`
        const dest = path.join(temp, repoName)

        await spinner(
          pify(gitClone)(repoUrl, dest, {
            shallow: true
          }),
          `Cloning "${repoAuthor}/${repoName}" repo for "${name}"`
        )

        let projectDirs = [dest]
        if (projects) {
          if (typeof projects === 'string' && projects.indexOf('*') < 0) {
            projectDirs = [projects]
          } else {
            projectDirs = await globby(projects, {
              cwd: dest,
              onlyDirectories: true,
              globstar: false
            })
          }

          projectDirs = projectDirs.map((projectDir) =>
            path.join(dest, projectDir)
          )
        }

        return pMap(
          projectDirs,
          async (projectDir) => {
            const projectConfigPath = path.join(projectDir, 'saasify.json')
            if (!(await fs.pathExists(projectConfigPath))) {
              throw new Error(
                `Error found invalid saasify project in "${name}" at "${projectDir}"`
              )
            }

            const config = await fs.readJson(projectConfigPath)
            return {
              projectDir,
              config
            }
          },
          {
            concurrency: 2
          }
        )
      },
      {
        concurrency: 1
      }
    )
  )
}
