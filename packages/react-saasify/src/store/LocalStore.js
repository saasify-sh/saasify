import localforage from 'localforage'

const cache = {}

export default class LocalStore {
  static get(...args) {
    const key = args[0]
    const cached = cache[key]
    if (cached) return Promise.resolve(cached)

    const value = localforage.getItem(...args)
    cache[key] = value

    return value
  }

  static set(...args) {
    const key = args[0]
    const value = args[1]
    cache[key] = value

    return localforage.setItem(...args)
  }

  static remove(...args) {
    const key = args[0]
    delete cache[key]

    return localforage.removeItem(...args)
  }
}

export { LocalStore }
