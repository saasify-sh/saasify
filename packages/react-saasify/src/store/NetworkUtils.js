/**
 * @class NetworkUtils
 *
 * Debugging utility that, when enabled, adds artificial latency to network
 * requests.
 */

export const NetworkUtils = {
  isDebugEnabled: () =>
    window.localStorage && window.localStorage.debugSlowNetwork === 'true',

  addDebugLatency: function(rpcP) {
    if (NetworkUtils.isDebugEnabled()) {
      const origRpcP = rpcP

      rpcP = new Promise((resolve, reject) => {
        setTimeout(() => {
          origRpcP.then(resolve).catch(reject)
        }, 10000)
      })
    }

    return rpcP
  }
}
