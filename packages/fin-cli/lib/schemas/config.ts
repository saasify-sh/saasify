// NOTE: this is just a pseudocode reference for now

class Config {
  version?: number = 1
  name?: string
  alias?: string
  amountPerRequest?: number = 0.0004
  amountPerCompute?: number = 0.0034
  amountPerBandwidth?: number = 0.2
  services: Service[]
}

class Service {
  src: string
  name?: string
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
