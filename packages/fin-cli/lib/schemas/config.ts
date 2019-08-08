// NOTE: this is just a pseudocode reference for now

class Config {
  version?: number = 1
  name?: string
  alias?: string
  services: Service[]
}

class Service {
  src: string
  name?: string
  route?: string
  amountPerRequest?: number = 1
  amountPerCompute?: number = 1
  timeout?: number = 300000
  authRateLimit?: RateLimit
  noAuthRateLimit?: RateLimit
  example?: object
}

class RateLimit {
  requests?: boolean = true
  requestsInterval?: number = 60000
  requestsMaxPerInterval?: number = 1000
}
