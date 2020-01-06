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

module.exports = async function getProjects(repos, opts) {
  const { temp } = opts

  return flatten(
    await pMap(
      repos,
      async (info) => {
        const { repository, projects } = info
        let { path: repoPath } = info

        if (repoPath) {
          repoPath = path.resolve(repoPath)
        } else {
          const [repoAuthor, repoName] = parseGitHubRepoUrl(repository)
          const repoUrl = `https://github.com/${repoAuthor}/${repoName}.git`
          repoPath = path.join(temp, repoName)

          await spinner(
            pify(gitClone)(repoUrl, repoPath, {
              shallow: true
            }),
            `Cloning "${repoAuthor}/${repoName}" repo"`
          )
        }

        let projectDirs = [repoPath]
        if (projects) {
          if (typeof projects === 'string' && !projects.includes('*')) {
            projectDirs = [projects]
          } else {
            projectDirs = await globby(projects, {
              cwd: repoPath,
              onlyDirectories: true,
              globstar: false
            })
          }

          projectDirs = projectDirs.map((projectDir) =>
            path.join(repoPath, projectDir)
          )
        }

        return pMap(
          projectDirs,
          async (projectDir) => {
            const projectConfigPath = path.join(projectDir, 'saasify.json')
            if (!(await fs.pathExists(projectConfigPath))) {
              throw new Error(
                `Error found invalid saasify project in ${projectDir}`
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
