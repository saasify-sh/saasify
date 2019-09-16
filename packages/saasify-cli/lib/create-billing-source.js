'use strict'

const stripe = require('./services/stripe')

module.exports = async (data) => {
  if (!data.expDate) {
    throw new Error('Please define a expiration date for your card')
  }

  const card = {
    name: data.name,
    number: data.cardNumber,
    cvc: data.ccv
  }

  card.exp_month = data.expDate[0]
  card.exp_year = data.expDate[1]

  console.log(card)
  return stripe.tokens.create({ card })
}
