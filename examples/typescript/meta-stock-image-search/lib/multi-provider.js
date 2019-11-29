'use strict'

const pTimeout = require('p-timeout')
const pCache = require('p-cache')

const DEFAULT_TIMEOUT = 5 * 1000

module.exports = (meta) => {
  const cache = pCache({
    label: meta.label,
    max: meta.max || 5000,
    length: (value) => 1 + value.results.length
  })

  return cache(async (opts) => {
    const {
      limit = meta.limit || 10,
      timeout = DEFAULT_TIMEOUT,
      metadata = {},
      query,
      offset
    } = opts

    const errors = []

    const wrap = async (label, asyncProviderFunc) => {
      try {
        const providerMetadata = metadata[label] || {}
        if (providerMetadata.limit) {
          providerMetadata.limit = parseInt(providerMetadata.limit, 10)
        }

        if (providerMetadata.offset) {
          providerMetadata.offset = parseInt(providerMetadata.offset, 10)
        }

        const params = Object.assign(
          {
            query,
            offset,
            limit
          },
          providerMetadata
        )

        if (params.limit <= 0) {
          return []
        }

        const results = await asyncProviderFunc(params)
        if (!results.length) {
          // remember this provider has run out of results
          providerMetadata.limit = 0
        } else {
          providerMetadata.offset =
            (providerMetadata.offset || 0) + results.length
        }

        metadata[label] = providerMetadata
        return results
      } catch (err) {
        errors.push(err)

        if (errors.length >= requests.length) {
          throw err
        } else {
          console.warn(
            `error ${meta.label} provider ${label} search "${query}"`,
            err
          )
        }

        return []
      }
    }

    const requests = meta.providers.map((provider) =>
      pTimeout(wrap(provider.label, provider.func), timeout, () => [])
    )

    const providers = await Promise.all(requests)
    const results = []

    // mix results from different providers together
    let hasResult
    let index = 0

    do {
      hasResult = false

      for (let i = 0; i < providers.length; ++i) {
        const result = providers[i][index]

        if (result) {
          results.push(result)
          hasResult = true
        }
      }

      ++index
    } while (hasResult)

    console.log(`${meta.label} search "${query}" => ${results.length} results`)
    // console.log({ metadata, results })

    return {
      metadata,
      results
    }
  })
}
