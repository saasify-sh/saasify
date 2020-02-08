'use strict'

const http = require('http')
const https = require('https')
const pick = require('lodash.pick')
const createError = require('http-errors')
const filterObj = require('filter-obj')

/**
 * Koa proxy middleware meant for easily setting up custom API proxies in front of Saasify.
 *
 * By default, `opts.getPath = (ctx) => ctx.req.path` which uses the incoming request's path
 * as the target path without any transforms.
 *
 * @name getSaasifyFaasProxy
 *
 * @param {object} [opts] - Config options.
 * @param {string} [opts.faasUrl='https://ssfy.sh'] - Base URL to proxy FaaS requests downstream.
 * @param {object} [opts.logger=console] - Logger (console or winston instancd).
 * @param {object} [opts.getPath] - Function to extract the target URL's path from the given request context.
 *
 * @return {function}
 */
module.exports = function getSaasifyFaasProxy(opts = {}) {
  const {
    faasUrl = 'https://ssfy.sh',
    logger = console,
    getPath = (ctx) => ctx.req.path,
    getParams = (ctx) => ctx.request.search
  } = opts

  const faasUrlProtocol = new URL(faasUrl).protocol
  const faasHttpImpl = faasUrlProtocol === 'http:' ? http : https

  return async function saasifyFaasProxy(ctx) {
    const path = getPath(ctx)
    const params = getParams(ctx)
    const target = `${faasUrl}/${path}`
    const url = new URL(target)

    // TODO: this should be a blacklist instead of a whitelist in order to allow custom
    // HTTP headers to be used.
    const headers = pick(ctx.req.headers, [
      'accept',
      'accept-charset',
      'accept-encoding',
      'accept-language',
      'accept-control-request-method',
      'accept-control-request-headers',
      'authorization',
      'cache-control',
      'connection',
      'content-length',
      'content-md5',
      'content-type',
      'date',
      'if-match',
      'if-modified-since',
      'if-none-match',
      'if-range',
      'if-unmodified-since',
      'max-forwards',
      'origin',
      'pragma',
      'range',
      'referer',
      'te',
      'transfer-encoding',
      'user-agent'
    ])

    const options = {
      ...pick(url, ['protocol', 'slashes', 'host', 'port', 'hostname', 'hash']),
      path: `${url.pathname}${params}`,
      method: ctx.req.method,
      headers
    }

    const debugInfo = {
      method: options.method,
      path: options.path,
      target
    }
    logger.info('faas pre-proxy', debugInfo)

    await new Promise((resolve, reject) => {
      const proxyReq = faasHttpImpl.request(options, (res) => {
        ctx.status = res.statusCode
        ctx.set(res.headers)

        debugInfo.status = ctx.status
        debugInfo.headers = getDebugHeaders(res.headers)
        logger.info(`faas proxy ${ctx.status}`, debugInfo)

        // proxy origin FaaS response to outgoing client response
        res.pipe(ctx.res).on('error', reject)

        res
          .on('error', reject)
          .on('aborted', reject)
          .on('end', resolve)
      })

      // proxy incoming client request to origin FaaS server
      ctx.isStream = true
      ctx.req.on('aborted', () => {
        proxyReq.abort()
        reject(createError(499, 'client aborted request'))
      })
      ctx.req.on('error', reject)
      ctx.req.pipe(proxyReq, { end: true }).on('error', reject)
    })

    logger.info(`faas post-proxy ${debugInfo.status}`, debugInfo)
  }
}

const resHeaderDebugWhitelist = new Set([
  'cache-control',
  'cf-cache-status',
  'content-type',
  'content-length',
  'x-proxy-response-time',
  'x-response-time'
])

function getDebugHeaders(headers) {
  return filterObj(headers, (key) => resHeaderDebugWhitelist.has(key))
}
