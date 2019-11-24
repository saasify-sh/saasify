'use strict'

const ccValidator = require('credit-card')
const { prompt } = require('enquirer')

const cardBrands = require('../card-brands')
const createBillingSource = require('../create-billing-source')
const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('cc <command> [id]')
    .alias('billing')
    .description('Manages your credit cards and billing methods')
    .action(async (cmd, id) => {
      program.requireAuthentication()

      try {
        switch (cmd) {
          case 'ls': {
            const [user, sources] = await spinner(
              Promise.all([client.getBilling(), client.listBillingSources()]),
              'Getting billing sources'
            )

            // TODO: better output formatting
            // TODO: better highlighting of default source
            program.appendOutput(JSON.stringify(sources, null, 2))
            console.log(`default source: ${user.stripeCustomer.default_source}`)
            break
          }

          case 'add': {
            const temp = {}

            const prompts = [
              {
                type: 'input',
                name: 'name',
                message: 'Full Name',
                validate: (value) => {
                  return value.trim().length > 0
                }
              },
              {
                type: 'input',
                name: 'cardNumber',
                message: 'Card Number',
                hint: '#### #### #### ####',
                format: (value) => {
                  value = value.replace(/\s/g, '')
                  value = value.replace(/[^\d]/g, '')

                  if (value.length >= 4) {
                    value = value.slice(0, 4) + ' ' + value.slice(4)

                    if (value.length >= 9) {
                      value = value.slice(0, 9) + ' ' + value.slice(9)

                      if (value.length >= 14) {
                        value = value.slice(0, 14) + ' ' + value.slice(14)

                        if (value.length <= 19) {
                          value = value.slice(0, 19)
                        }
                      }
                    }
                  }

                  return value
                },
                validate: (value) => {
                  value = value.replace(/\s/g, '')
                  const type = ccValidator.determineCardType(value)
                  return type && ccValidator.isValidCardNumber(value, type)
                },
                result: (value) => {
                  temp.cardNumber = value.replace(/\s/g, '')
                  temp.type = ccValidator.determineCardType(temp.cardNumber)
                  temp.brand = cardBrands[temp.type]
                  return temp.cardNumber
                }
              },
              {
                type: 'input',
                name: 'ccv',
                message: 'CCV',
                hint: '###',
                validate: (value) => {
                  const brand = temp.brand.toLowerCase()
                  return ccValidator.doesCvvMatchType(value, brand)
                }
              },
              {
                type: 'input',
                name: 'expDate',
                message: 'Expiration Date',
                hint: 'mm/yyyy',
                validate: (value) => {
                  const parts = value.replace(/\s/g, '').split('/')
                  return !ccValidator.isExpired(...parts)
                },
                result: (value) => {
                  return value.replace(/\s/g, '').split('/')
                }
              }
            ]

            console.log('Please enter your credit card details:')
            const card = await prompt(prompts)
            let token

            try {
              const result = await spinner(
                createBillingSource(card),
                'Creating secure billing token'
              )
              token = result.id
            } catch (err) {
              console.error('Error initializing payment source', err.message)
              process.exit(1)
            }

            const source = await spinner(
              client.addBillingSource({ source: token }),
              'Attaching billing source to user'
            )
            program.appendOutput(JSON.stringify(source, null, 2))
            break
          }

          case 'rm': {
            if (!id) {
              console.error(
                'error: you must specify the id of a billing source id to remove'
              )
              process.exit(1)
            }

            const source = await spinner(
              client.removeBillingSource(id),
              'Removing billing source'
            )
            console.log(JSON.stringify(source, null, 2))
            break
          }

          case 'set-default': {
            if (!id) {
              console.error(
                'error: you must specify the id of a billing source id to set-default'
              )
              process.exit(1)
            }

            const source = await spinner(
              client.setDefaultBillingSource(id),
              'Setting default billing source'
            )
            program.appendOutput(JSON.stringify(source, null, 2))
            break
          }

          default: {
            if (!cmd) {
              console.error(
                'error: must specify a billing command (ls, add, rm, or set-default)'
              )
            } else {
              console.error(
                `error: invalid billing command [${cmd}] (ls, add, rm, or set-default)`
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
