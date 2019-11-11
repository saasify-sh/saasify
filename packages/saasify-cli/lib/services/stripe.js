'use strict'

const env = process.env.NODE_ENV || 'development'
const envIsProd = env === 'production'

const publicKey = envIsProd
  ? 'pk_live_3vousdHKwzzKdrP0quCQPWcr'
  : 'pk_test_FvYaeQlk6RbGIL9E36p9xNRo'

module.exports = require('stripe')(publicKey)
