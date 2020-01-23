// NOTE: this is just a convenient pseudocode reference that should be kept
// in sync with the corresponding JSON Schema. The JSON Schema is actually
// used as the source of truth for validation within the saasify cli.

class Config {
  saasifyVersion?: number = 1
  version?: string = '0.1.0'
  name?: string
  description?: string

  // pricing
  pricingPlans: PricingPlan[]
  coupons?: Coupon[]

  // @deprecated pricing; use `pricingPlans` instead
  amountPerBase?: number = 99
  amountPerRequest?: number = 0.04
  amountPerCompute?: number = 0
  amountPerBandwidth?: number = 0
  authRateLimit?: RateLimit
  noAuthRateLimit?: RateLimit

  // general config
  build?: object
  env?: object
  headers?: object
  immutable?: boolean

  // saas client
  saas?: object

  // core services
  services: Service[]
}

class PricingPlan {
  name: string
  slug: string

  desc?: string
  auth?: boolean
  features?: string[]

  amountPerBase?: number
  requests?: PricingPlanMetric

  rateLimit?: RateLimit
}

class PricingPlanMetric {
  amount?: number

  tiers?: PricingPlanTier[]
  tiersMode?: string = 'graduated'

  billingScheme?: string = 'per_unit' // | tiered
  usageType?: string = 'metered' // | licensed
}

class PricingPlanTier {
  unitAmount?: number
  flatAmount?: number
  upTo: string
}

class Service {
  src: string
  name?: string
  timeout?: number = 0
  examples?: Example[]
  config?: object
  GET?: boolean
  POST?: boolean
  headers?: object
  immutable?: boolean

  rateLimit?: boolean | RateLimit

  pricingPlanConfig?: PricingPlanServiceConfigMap
}

class PricingPlanServiceConfigMap {
  [plan: string]: PricingPlanServiceConfig
}

class PricingPlanServiceConfig {
  enabled?: boolean
  rateLimit?: boolean | RateLimit
}

class Example {
  name: string
  description?: string
  input: object
  inputContentType?: string = 'application/json'
  snippet?: Snippet
}

class RateLimit {
  requests?: boolean = true
  requestsInterval?: number = 60000
  requestsMaxPerInterval?: number = 1000
}

class SaaS {
  name?: string
  repo?: string
  heading?: string
  subheading?: string
  logo?: string
  favicon?: string
  features?: Feature[]
  sections?: object
  theme?: Theme
}

class Theme {
  name?: string
  '@primary-color'?: string
  '@section-bg-color'?: string
  '@section-fg-color'?: string
}

class Feature {
  name: string
  desc: string
  icon: string
}

class Coupon {
  name?: string

  currency?: string
  amount_off?: number
  percent_off?: number

  duration: string
  duration_in_months?: number

  redeem_by?: string
  max_redemptions?: number
}

class Snippet {
  language: string
  label: string
  code: string
  exclusive?: boolean = false
}
