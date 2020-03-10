export const CachePolicy = {
  /**
   * The query does not load from the cache or save results to the cache.
   */
  IgnoreCache: Symbol('IgnoreCache'),

  /**
   * The query only loads from the cache, ignoring the network. Will error if
   * there are no cached results.
   */
  CacheOnly: Symbol('CacheOnly'),

  /**
   * The query does not load from the cache, but it will save results to the
   * cache.
   */
  NetworkOnly: Symbol('NetworkOnly'),

  /**
   * The query first tries to load from the cache, but if that fails, it
   * tries to load results from the network.
   */
  CacheElseNetwork: Symbol('CacheElseNetwork'),

  /**
   * The query first tries to load from the network, but if that fails, it
   * tries to load results from the cache.
   */
  NetworkElseCache: Symbol('NetworkElseCache'),

  /**
   * The query first loads from the cache, then loads from the network. In
   * this case, the result set may update twice - first with the cached results,
   * then with the network results, but only if the network results differ from
   * the cached results.
   *
   * CacheThenNetwork is the default cache policy.
   */
  CacheThenNetwork: Symbol('CacheThenNetwork')
}
