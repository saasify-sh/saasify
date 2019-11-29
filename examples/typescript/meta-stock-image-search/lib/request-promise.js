'use strict'

module.exports = require('request-promise-native').defaults({
  // mimic requsts from chrome v61 on mac os
  headers: {
    'accept-language': 'en-US,en;q=0.8',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.71 Safari/537.36'
  }
})
