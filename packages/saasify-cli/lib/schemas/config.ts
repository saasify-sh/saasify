// NOTE: this is just a convenient pseudocode reference that should be kept
// in sync with the corresponding JSON Schema. The JSON Schema is actually
// used as the source of truth for validation within the saasify cli.

class Config {
  // project name
  name?: string

  // optional version info
  saasifyVersion?: number = 1
  version?: string = '0.1.0'

  // optional metadata
  description?: string
  keywords?: string[]

  // pricing
  pricingPlans?: PricingPlan[]
  coupons?: Coupon[]

  // @deprecated; use `pricingPlans` instead
  // amountPerBase?: number = 99
  // amountPerRequest?: number = 0.04
  // amountPerCompute?: number = 0
  // amountPerBandwidth?: number = 0
  // authRateLimit?: RateLimit
  // noAuthRateLimit?: RateLimit

  // general config
  build?: object
  env?: object
  headers?: object
  immutable?: boolean

  // saas marketing site config
  saas?: object

  // TODO
  openapi?: string | object

  // core services
  services: Service[]
}

class PricingPlan {
  // display name of this pricing plan
  name: string

  // by default, this is inferred from the plan name
  slug?: string

  // optional display description
  desc?: string

  // whether or not this plan requires authentication
  auth?: boolean

  // UI-only list of features to display for this plan (supports Markdown)
  features?: string[]

  // base amount to charge per month (licensed billing)
  // 99 = $0.99
  // 499 = $4.99
  // 2999 = $29.99
  amount?: number = 0

  // optional metered billing per request
  requests?: PricingPlanMeteredConfig

  // optional rate limit to enforce on this plan
  rateLimit?: RateLimit
}

class PricingPlanMeteredConfig {
  // amount to charge for each request in USD cents (metered billing)
  // 100 = $1.00
  // 2 = $0.02
  // 0.05 = $0.0005
  amount?: number

  // more advanced per-plan tiered pricing options
  billingScheme?: string = 'per_unit' // | tiered
  tiers?: PricingPlanTier[]
  tiersMode?: string = 'graduated' // | volume
}

class PricingPlanTier {
  unitAmount?: number
  flatAmount?: number
  upTo: string
}

class Service {
  src?: string
  name?: string
  examples?: Example[]
  config?: object

  GET?: boolean
  POST?: boolean

  headers?: object
  immutable?: boolean

  // whether to report calls to this service (only applicable to metered billing)
  reportUsage?: boolean = true

  // disable or customize this service's rate limits (defaults to the active pricing plan's rate limits)
  rateLimit?: null | RateLimit

  // customize this service depending on the active pricing plan
  pricingPlanConfig?: PricingPlanServiceConfigMap
}

class PricingPlanServiceConfigMap {
  // map of pricing plan slug to service config overrides for a given plan
  [plan: string]: PricingPlanServiceConfig
}

class PricingPlanServiceConfig {
  // whether this service is enabled for a given pricing plan
  enabled?: boolean

  // whether to report calls to this service on a given pricing plan (for metered usage)
  reportUsage?: boolean

  // disable or customize this service's rate limits for a given pricing plan
  rateLimit?: null | RateLimit
}

class Example {
  name: string
  description?: string
  input: object
  inputContentType?: string = 'application/json'
  snippet?: Snippet
}

class RateLimit {
  // whether or not this rate limit is enabled
  enabled?: boolean = true

  // interval given either in seconds or as a human-readable string
  requestsInterval?: number | string = '1h'

  // maximum number of requests allowed per rate limit interval
  requestsMaxPerInterval?: number = 1000
}

class SaaS {
  name?: string
  repo?: string
  heading?: string
  subheading?: string
  logo?: string
  logoLight?: string
  favicon?: string
  features?: Feature[]
  sections?: object
  theme?: Theme
  socialShare?: object
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
