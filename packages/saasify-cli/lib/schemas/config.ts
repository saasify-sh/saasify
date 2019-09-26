// NOTE: this is just a pseudocode reference for now

class Config {
  saasifyVersion?: number = 1
  version?: string = 0.1.0
  name?: string
  amountPerBase?: number = 99
  amountPerRequest?: number = 0.04
  amountPerCompute?: number = 0.34
  amountPerBandwidth?: number = 20
  authRateLimit?: RateLimit
  noAuthRateLimit?: RateLimit
  services: Service[]
  saas?: object
}

class Service {
  src: string
  name?: string
  timeout?: number = 0
  examples?: Example[]
}

class Example {
  name: string
  input: object
  output?: string | object
}

class RateLimit {
  requests?: boolean = true
  requestsInterval?: number = 60000
  requestsMaxPerInterval?: number = 1000
}
