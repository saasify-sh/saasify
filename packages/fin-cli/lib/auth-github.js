'use strict'

const findFreePort = require('find-free-port')
const Koa = require('koa')
const open = require('open')
const qs = require('qs')
const url = require('url')

module.exports = async (client) => {
  let _resolve
  let _reject

  const serverP = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  const [ port ] = await findFreePort(3000)
  const app = new Koa()
  app.use(async (ctx) => {
    const { query } = url.parse(ctx.req.url)
    const params = qs.parse(query)

    if (!params.code) {
      _reject(params)
      ctx.body = 'Error authenticated Fin with GitHub.'
    }

    _resolve(params)
    ctx.body = 'Fin authenticated with GitHub successfully.'
  })

  let server
  await new Promise((resolve, reject) => {
    server = app.listen(port, (err) => {
      if (err) return reject(err)
      else return resolve()
    })
  })

  // TODO: handle production usage auth redirection properly
  const config = client.baseUrl.indexOf('localhost') >= 0
    ? ({
      client_id: '86d73532d0105da51a4d',
      redirect_uri: `http://localhost:${port}/auth/github`
    }) : ({
      client_id: '6525c812c9b4430147c3',
      redirect_uri: `https://functional-income.com/auth/github`
    })

  const opts = qs.stringify(config)
  open(`https://github.com/login/oauth/authorize?${opts}`)
  const params = await serverP

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)
      else return resolve()
    })
  })

  return client.authWithGitHub({
    ...config,
    ...params
  })
}
