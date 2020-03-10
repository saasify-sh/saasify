/**
 * @class ReactLiveQuery
 *
 * Live query for models capable of loading an infinite number of paged or
 * non-paged results from a local cache and/or the network. Also handles
 * optionally updating the local cache when receiving new results from the
 * network and "live updating" via recalculating the list of results from the
 * local cache whenever model updates are received from the server.
 *
 * MobX provides a perfect way to link the "live" state of the query to a React
 * component such that the observer component will re-render only the changed
 * portion of results whenever the result set is updated.
 */

import { observable, computed } from 'mobx'
import uniqBy from 'lodash.uniqby'

import { CachePolicy } from './CachePolicy'
import { NetworkUtils } from './NetworkUtils'

export class ReactLiveQuery {
  static CachePolicy = CachePolicy

  constructor(opts) {
    if (!opts) {
      throw new Error(`ReactLiveQuery invalid options ${opts}`)
    }

    this.opts = {
      /*
      network: {
        find: (options) => Promise<Array<Object>>
      },

      cache: {
        find: (options) => Promise<Array<Object>>,
        upsertBatch: (models) => Promise<Void>
      }
      */

      network: undefined,
      cache: undefined,

      key: 'id',

      // whether or not paging is enabled
      paged: true,

      // whether new results should be prepended or appended
      prepend: false,

      isSingleModel: false,

      // limit and offset for page loading
      limit: 25,
      offset: 0,

      enqueueDebounceTimeout: 150,
      model: undefined,
      policy: CachePolicy.NetworkOnly,
      silent: false,
      transforms: [],

      debug: console.log.bind(console),

      ...opts
    }

    this._requiresNetwork = false
    this._requiresCache = false

    switch (this.opts.policy) {
      // load from network only without updating cache
      case CachePolicy.IgnoreCache:
        this._requiresNetwork = true
        break

      // load from cache only
      case CachePolicy.CacheOnly:
        this._requiresCache = true
        break

      // load from network and update cache
      case CachePolicy.NetworkOnly:
        this._requiresNetwork = true
        this._requiresCache = false
        break

      // load from cache falling back to network
      case CachePolicy.CacheElseNetwork:
        this._requiresNetwork = true
        this._requiresCache = true
        break

      // load from network falling back to cache
      case CachePolicy.NetworkElseCache:
        this._requiresNetwork = true
        this._requiresCache = true
        break

      // load from cache and network in parallel
      case CachePolicy.CacheThenNetwork:
        this._requiresNetwork = true
        this._requiresCache = true
        break

      default:
        throw new Error(
          `ReactLiveQuery invalid CachePolicy ${String(this.opts.policy)}`
        )
    }

    if (
      this._requiresNetwork &&
      !ReactLiveQuery.isValidNetwork(this.opts.network)
    ) {
      throw new Error(
        `ReactLiveQuery CachePolicy ${String(
          this.opts.policy
        )} requires valid network`
      )
    }

    if (this._requiresCache && !ReactLiveQuery.isValidCache(this.opts.cache)) {
      throw new Error(
        `ReactLiveQuery CachePolicy ${String(
          this.opts.policy
        )} requires valid cache`
      )
    }

    this._resultsMap = {}
  }

  static isValidNetwork = (network) => {
    return network && isFunction(network.find)
  }

  static isValidCache = (cache) => {
    return cache && isFunction(cache.find) && isFunction(cache.upsertBatch)
  }

  /**
   * Query result that will live update via mobx as additional updates are
   * received.
   *
   * Only valid for `isSingleModel` queries; for lists of results, use
   * `results` instead.
   *
   * @name ReactLiveQuery#result
   * @property {Object}
   * @readonly
   */
  @computed get result() {
    if (this.opts.isSingleModel) {
      const results = this.results
      return results && results.length && results[0]
    } else {
      throw new Error(
        `ReactLiveQuery attempt to access invalid single result ${this.opts.model}`
      )
    }
  }

  /**
   * Query results that will live update via mobx as additional updates are
   * received.
   *
   * @name ReactLiveQuery#results
   * @property {Array<Model>}
   * @readonly
   */
  @computed get results() {
    if (this.opts.transforms.length) {
      let results = this._results

      // apply each transform in the chain
      this.opts.transforms.forEach((transform) => {
        results = transform(results)
      })

      return results
    } else {
      return this._results
    }
  }

  @observable.shallow
  _results = []

  /**
   * Whether or not the query is currently loading the first page of results.
   *
   * @name ReactLiveQuery#isLoadingInitialResults
   * @property {boolean}
   * @readonly
   */
  @observable
  isLoadingInitialResults = true

  /**
   * Whether or not the query is currently loading any page of results.
   *
   * @name ReactLiveQuery#isLoading
   * @property {boolean}
   * @readonly
   */
  @observable
  isLoading = false

  /**
   * Status of the query, will be either 'initial', 'active', 'complete', 'error', or
   * 'frozen'.
   *
   * @name ReactLiveQuery#status
   * @property {string}
   * @readonly
   */
  @observable
  status = 'initial'

  /**
   * Loads the next page of results if possible. Whether results will be loaded
   * from the cache, network, or some combination of the two depends on the
   * CachePolicy set for this query.
   *
   * @return {Promise}
   */
  load() {
    if (this._loadingP) {
      return this._loadingP
    }

    if (this.status !== 'initial' && this.status !== 'active') {
      return Promise.resolve()
    }

    if (this.status === 'initial') {
      this.status = 'active'
    }

    const baseResults = this._results
    let updateCache = false
    let resultP = null

    this.isLoading = true

    switch (this.opts.policy) {
      // load from network only without updating cache
      case CachePolicy.IgnoreCache:
        resultP = this._loadFromNetwork()
        break

      // load from cache only
      case CachePolicy.CacheOnly:
        resultP = this._loadFromCache()
        break

      // load from network and update cache
      case CachePolicy.NetworkOnly:
        updateCache = true
        resultP = this._loadFromNetwork()
        break

      // load from cache falling back to network
      case CachePolicy.CacheElseNetwork:
        resultP = this._loadFromCache()
          .catch(() => {
            return []
          })
          .then((results) => {
            if (results && results.length) {
              return results
            } else {
              updateCache = true
              return this._loadFromNetwork()
            }
          })
        break

      // load from network falling back to cache
      case CachePolicy.NetworkElseCache:
        resultP = this._loadFromNetwork()
          .catch(() => {
            return []
          })
          .then((results) => {
            if (results && results.length) {
              updateCache = true
              return results
            } else {
              return this._loadFromCache()
            }
          })
        break

      // load from cache and network in parallel
      case CachePolicy.CacheThenNetwork:
        {
          const cacheP = this._loadFromCache().catch(() => {
            return []
          })

          // useful for testing loading from cache
          const networkP = this._loadFromNetwork()

          resultP = cacheP.then((cacheResults) => {
            if (cacheResults && cacheResults.length) {
              this._updateResults(cacheResults, baseResults, false, true)
            }

            updateCache = true
            return networkP.then((networkResults) => {
              if (networkResults) {
                return networkResults
              } else {
                // TODO: refactor so we don't have to load from cache twice
                return this._loadFromCache()
              }
            })
          })
        }
        break

      default:
        throw new Error(
          `ReactLiveQuery invalid CachePolicy ${this.opts.policy}`
        )
    }

    this._loadingP = resultP
    return resultP.then(
      (results) => {
        if (this.status === 'frozen') {
          return
        }

        results = results || []

        const updateP = this._updateResults(
          results,
          baseResults,
          updateCache,
          false
        )

        if (this.opts.paged) {
          this.opts.offset += results.length
          // invariant; this._skip === this._results.length

          if (results.length < this.opts.limit) {
            this.status = 'complete'
          } else {
            this.status = 'active'
          }
        } else {
          this.status = 'complete'
        }

        this._loadingP = null
        this.isLoading = false
        return updateP
      },
      (err) => {
        if (this.status === 'frozen') {
          return
        }

        this.opts.debug('query error', this.opts.model, err)

        this.status = 'error'
        this._loadingP = null
        this.isLoading = false
      }
    )
  }

  /**
   * Marks this query as frozen and removes any internal event listeners.
   *
   * Note that query state will never be updated after being frozen even if
   * load is called again afterwards.
   *
   * This is useful for deallocating queries when they're no longer used and
   * for supporting "non-live" queries which don't auto-update.
   */
  freeze() {
    this.status = 'frozen'
  }

  /**
   * Replaces all results in this query with fresh ones from the network.
   *
   * @return {Promise}
   */
  refresh() {
    if (this.status === 'frozen') {
      return Promise.resolve()
    }

    if (!ReactLiveQuery.isValidNetwork(this.opts.network)) {
      return Promise.reject(
        new Error(
          `ReactLiveQuery.refresh not supported for this query ${this.opts.model}`
        )
      )
    }

    if (this.status === 'error') {
      this.status = 'active'
    } else if (this.isLoadingInitialResults) {
      // query is not active yet
      return Promise.resolve()
    }

    this.opts.debug(`${this.opts.model} refresh`)
    const options = {}

    if (this.opts.paged) {
      options.limit = this.opts.offset || this.opts.limit
      options.offset = 0
    }

    return this._loadFromNetwork(options).then(
      (results) => {
        if (results) {
          this._replaceResults(results)

          // update cache after refresh and replace results
          return this._updateCache(results)
        }
      },
      (err) => {
        this.opts.debug(`${this.opts.model} refresh error`, err)
      }
    )
  }

  /**
   * Updates the query with new results.
   *
   * @param {Array<model>} results
   * @param {Array<model>} baseResults
   * @param {boolean} udpateCache
   *
   * @return {Promise}
   */
  _updateResults(results, baseResults, updateCache, isTempUpdateFromCache) {
    if (this.status === 'frozen') {
      return Promise.resolve()
    }

    if (results) {
      results = results.map((result) => {
        const id = result[this.opts.key]

        if (!isTempUpdateFromCache) {
          const existing = this._resultsMap[id]
          if (existing) {
            result = existing
          }
        }

        this._resultsMap[id] = result
        return result
      })

      let aggregateResults

      if (this.opts.prepend) {
        // for prepending, we must reverse the results to maintain ordering
        results = results.reverse()
        aggregateResults = results.concat(baseResults.slice())
      } else {
        aggregateResults = baseResults.slice().concat(results)
      }

      this._results = uniqBy(aggregateResults, this.opts.key)

      this.opts.debug(
        `${this.opts.model} added ${results.length} results for a total of ${this._results.length}`
      )

      this.isLoading =
        isTempUpdateFromCache &&
        this.isLoadingInitialResults &&
        this.opts.paged &&
        this._results.length < this.opts.limit
      this.isLoadingInitialResults = false

      if (updateCache && results.length > 0) {
        return this._updateCache(results)
      }
    }

    return Promise.resolve()
  }

  /**
   * Replaces the current list of results with a completely new list.
   *
   * @param {Array<model>} results
   * @param {Number} numUpdated Hint for number of results that were updated
   *
   * @return {Promise}
   */
  _replaceResults(results, numUpdated = 0) {
    if (this.status === 'frozen') {
      return
    }

    results = results || []
    if (this.opts.prepend) {
      // for prepending, we must reverse the results to maintain ordering
      results = results.reverse()
    }

    this._resultsMap = {}
    results.forEach((result) => {
      const id = result[this.opts.key]

      this._resultsMap[id] = result
    })

    this.opts.debug(
      `${this.opts.model} replaced ${this._results.length} results with ${results.length} (${numUpdated} updated)`
    )
    this._results = results

    if (this.opts.paged) {
      this.opts.offset = results.length
    }
  }

  /**
   * Updates the cache with the list of fresh results.
   *
   * @param {Array<Model>} results
   *
   * @return {Promise}
   */
  _updateCache(results) {
    if (this.status === 'frozen' || !this._requiresCache) {
      return Promise.resolve()
    }

    if (!ReactLiveQuery.isValidCache(this.opts.cache)) {
      return Promise.reject(
        new Error(
          `_updateCache ${this.opts.model} not supported for this query`
        )
      )
    }

    return this.opts.cache
      .upsertBatch(results)
      .then(() => {
        this.opts.debug(`${this.opts.model} cached ${results.length} docs`)
      })
      .catch((err) => {
        this.opts.debug(
          'error updating cache',
          this.opts.model,
          results.length,
          err
        )
        // updating cache is technically optional, so don't propagate the Promise rejection
      })
  }

  /**
   * Loads the query's current page from the cache.
   *
   * @return {Promise<Array<Model>>}
   */
  _loadFromCache(opts) {
    if (this.status === 'frozen') {
      return Promise.resolve()
    }

    if (!ReactLiveQuery.isValidCache(this.opts.cache)) {
      return Promise.reject(
        new Error(
          `_loadFromCache ${this.opts.model} not supported for this query`
        )
      )
    }

    return this.opts.cache
      .find({
        offset: this.opts.paged && this.opts.offset,
        limit: this.opts.paged && this.opts.limit,
        sort: this.opts.sort,
        ...opts
      })
      .then((results) => {
        this.opts.debug(
          `${this.opts.model} loaded ${results.length} results from cache`
        )
        return results
      })
  }

  /**
   * Loads the query's current page from the network.
   *
   * @return {Promise<Array<Model>>}
   */
  _loadFromNetwork(opts) {
    if (this.status === 'frozen') {
      return Promise.resolve()
    }

    if (!ReactLiveQuery.isValidNetwork(this.opts.network)) {
      return Promise.reject(
        new Error(
          `_loadFromNetwork ${this.opts.model} not supported for this query`
        )
      )
    }

    const defaults = {}

    if (this.opts.paged) {
      defaults.offset = this.opts.offset
      defaults.limit = this.opts.limit
    }

    if (this.opts.sort) {
      defaults.sort = this.opts.sort
    }

    const rpc = this.opts.network.find(Object.assign(defaults, opts))

    // debugging utility that adds artificial latency to all network requests
    const wrappedRpc = NetworkUtils.addDebugLatency(rpc)

    return wrappedRpc
      .then((results) => {
        this.opts.debug(
          `${this.opts.model} loaded ${results.length} results from network`
        )
        return results
      })
      .catch((err) => {
        this.opts.debug(`${this.opts.model} error loading from network`, err)
        throw err
      })
  }

  /**
   * Enqueues a model enqueue update for processing to potentially update the
   * results of this query.
   *
   * Note that enqueue events are debounced such that receiving many events in
   * a short period of time will only result in a single recalculation of the
   * query results from the cache.
   *
   * @param {Model|Array<Model>} [model]
   */
  notifyUpdates = (result) => {
    if (
      this.opts.policy !== CachePolicy.IgnoreCache &&
      this.opts.policy !== CachePolicy.NetworkOnly
    ) {
      return
    }

    if (this.isLoadingInitialResults) {
      return
    }

    this.opts.debug('enqueue', this.opts.model, result)

    if (this._enqueueHandler) {
      clearTimeout(this._enqueueHandler)
    }

    if (!this._enqueued) {
      this._enqueued = {}
    }

    // NOTE (travis): it doesn't matter which model we save if we have a
    // conflict. _resolveEnqueuedUpdates will use a fresh model from
    // queried from the cache instead of the enqueued model.
    if (result) {
      if (Array.isArray(result)) {
        result.forEach((model) => {
          const id = model[this.opts.key]
          this._enqueued[id] = true
        })
      } else {
        const id = result[this.opts.key]
        this._enqueued[id] = true
      }
    }

    this._enqueueHandler = setTimeout(() => {
      this._enqueueHandler = null
      this._resolveEnqueuedUpdates()
    }, this._enqueueDebounceTimeout)
  }

  /**
   * Recalculates the query's entire list of results based on the local cache.
   *
   * This will be called whenever one or more server updates are enqueued to
   * ensure that the query's list of results is always up-to-date.
   *
   * NOTE: this could potentially be more efficient by figuring out where
   * the enqueued updates should be placed in the existing result set, but
   * this would also be more error-prone, and recalculating the result set
   * empirically works good enough for now.
   */
  _resolveEnqueuedUpdates = () => {
    if (this.status === 'frozen') {
      return
    }

    const enqueued = this._enqueued
    this._enqueued = {}

    const numEnqueued = Object.keys(enqueued).length
    this.opts.debug(
      `${this.opts.model} processing ${numEnqueued} enqueued updates`,
      enqueued
    )

    const limit = Math.max(
      this.opts.paged && this.opts.limit,
      this._results.length + numEnqueued
    )

    this._loadFromCache({
      offset: 0,
      limit: limit
    })
      .then((results) => {
        this.opts.debug(
          `${this.opts.model} loaded ${results.length} from cache after enqueue`
        )

        // NOTE: it's important to not replace all results with new instances in
        // order to reuse their previous values as much as possible for results
        // which won't change. this is so mobx + react will only try to re-render
        // the minimal number of components.
        let numUpdated = 0
        results = results.map((result) => {
          const id = result[this.opts.key]
          const existing = this._resultsMap[id]

          if (existing) {
            if (enqueued[id]) {
              // result is coming fresh from cache, so prioritize that over any
              // temp enqueued results that notified us of a model update
              this._resultsMap[id] = result
              numUpdated++
            } else {
              result = existing
            }
          } else {
            numUpdated++
          }

          return result
        })

        this._replaceResults(results, numUpdated)
      })
      .catch((err) => {
        this.opts.debug(
          `${this.opts.model} error processing enqueued updates`,
          err
        )
      })
  }
}

function isFunction(value) {
  return value && typeof value === 'function'
}
