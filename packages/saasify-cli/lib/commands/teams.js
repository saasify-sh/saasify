'use strict'

const { prompt } = require('enquirer')
const { validators } = require('saasify-utils')

const auth = require('../auth')
const handleError = require('../handle-error')
const spinner = require('../spinner')

const defaultUserTeam = {}

module.exports = (program, client) => {
  program
    .command('teams <command> [arg]')
    .description('Manages your teams (ls, add, invite, switch)')
    .action(async (cmd, arg) => {
      program.requireAuthentication()

      try {
        switch (cmd) {
          case 'ls': {
            const teams = await spinner(client.listTeams(), 'Fetching teams')

            // TODO: better output formatting
            program.appendOutput(JSON.stringify(teams, null, 2))
            break
          }

          case 'add': {
            const prompts = [
              {
                type: 'input',
                name: 'slug',
                message: 'Team identifier (slug, all lowercase)',
                hint: 'my-team-slug',
                validate: (value) => {
                  return validators.username(value)
                }
              },
              {
                type: 'input',
                name: 'name',
                message: 'Team name (label)',
                hint: 'My Team'
              }
            ]

            const info = await prompt(prompts)

            const team = await spinner(client.createTeam(info), 'Creating team')

            client.teamId = team.id
            auth.switchTeam(team)

            program.appendOutput(JSON.stringify(team, null, 2))
            break
          }

          // TODO: this would be pretty easy to accidentally do and would prevent you
          // from accessing any of your deployments, so disabling this for now.

          /*
          case 'rm': {
            console.error(
              'error: removing teams has been disabled in the CLI for now. please contact support for help.'
            )
            process.exit(1)

            if (!arg) {
              console.error('error: must specify the id of the team you want to remove')
              process.exit(1)
            }

            await spinner(
              client.removeTeam(arg),
              `Removing team [${arg}]`
            )

            if (arg === client.teamId) {
              auth.switchTeam(defaultUserTeam)

              // TODO: make the client handling of team less error-prone
              client.teamId = undefined
              client.teamSlug = undefined
            }
            break
          }
          */

          case 'switch': {
            const teams = await spinner(client.listTeams(), 'Fetching teams')

            const choices = teams.map((team) => `${team.slug} (${team.name})`)
            const choiceToTeamMap = {}
            for (let i = 0; i < choices.length; ++i) {
              const choice = choices[i]
              choiceToTeamMap[choice] = teams[i]
            }

            const userTeam = `${client.user.username} (${client.user.email})`
            choices.push(userTeam)
            choiceToTeamMap[userTeam] = defaultUserTeam

            let team

            if (arg) {
              team = teams.find(({ slug }) => slug === arg)

              if (!team && arg === client.user.username) {
                team = defaultUserTeam
              }
            } else {
              const prompts = [
                {
                  type: 'select',
                  name: 'team',
                  message: 'Switch to team:',
                  choices
                }
              ]

              if (client.teamSlug) {
                console.log(`Currently active team: "${client.teamSlug}"`)
              }

              const info = await prompt(prompts)
              team = choiceToTeamMap[info.team]
            }

            if (team) {
              client.teamId = team.id
              auth.switchTeam(team)

              console.log('done')
            } else {
              console.error(`error: unable to infer team "${arg}"`)
              process.exit(1)
            }

            break
          }

          case 'invite': {
            if (!client.teamId) {
              console.error(
                'error: you must switch to an active team before inviting a member to join'
              )
              process.exit(1)
            }

            if (!arg) {
              console.error(
                'error: you must specify the username of the saasify user you want to invite'
              )
              process.exit(1)
            }

            if (!validators.username(arg)) {
              console.error(`error: the username "${arg}" is invalid`)
              process.exit(1)
            }

            await spinner(
              client.inviteTeamMember(client.teamId, { username: arg }),
              `Sending invite to user "${arg}"`
            )

            console.log(
              `User "${arg}" has been invited to your active team "${client.teamSlug}"`
            )
            break
          }

          default: {
            if (!cmd) {
              console.error(
                'error: must specify a team command (ls, add, invite, switch)'
              )
            } else {
              console.error(
                `error: invalid team command [${cmd}] (ls, add, invite, switch)`
              )
            }

            process.exit(1)
          }
        }
      } catch (err) {
        handleError(program, err)
      }
    })
}
