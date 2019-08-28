import deployment from './deployment'

const intervalToLabel = (intervalS) => {
  switch (intervalS) {
    case 60:
      return 'minute'
    case 3600:
      return 'hour'
    case 86400:
      return 'day'
    case 604800:
      return 'week'
    case 2.628e+6:
      return 'month'
    default:
      return `${intervalS} seconds`
  }
}

const { noAuthRateLimit } = deployment

let requestsRateLimit
let computeRateLimit
// TODO: make this default dynamic
let bandwidthRateLimit = '100 GB / mo'

if (noAuthRateLimit && noAuthRateLimit.enabled) {
  const requestsIntervalLabel = intervalToLabel(noAuthRateLimit.requestsInterval)
  requestsRateLimit = `${noAuthRateLimit.requestsMaxPerInterval} / ${requestsIntervalLabel}`

  if (noAuthRateLimit.compute) {
    const computeIntervalLabel = intervalToLabel(noAuthRateLimit.computeInterval)
    computeRateLimit = `${noAuthRateLimit.computeMaxPerInterval} / ${computeIntervalLabel}`
  }

  if (noAuthRateLimit.bandwidth) {
    const bandwidthIntervalLabel = intervalToLabel(noAuthRateLimit.bandwidthInterval)
    bandwidthRateLimit = `${noAuthRateLimit.bandwidthMaxPerInterval} / ${bandwidthIntervalLabel}`
  }
}

export default [
  {
    name: 'Free',
    key: 'free',
    type: 'secondary',
    desc: 'FREE FOREVER',
    price: '$0.00',
    interval: 'mo',
    requests: {
      price: '$0 / call',
      rateLimit: requestsRateLimit
    },
    compute: {
      price: '$0 / GB-s',
      rateLimit: computeRateLimit
    },
    bandwidth: {
      price: '$0 / GB',
      rateLimit: bandwidthRateLimit
    }
  },
  {
    name: 'Unlimited',
    key: 'unlimited',
    type: 'primary',
    desc: 'STARTING AT',
    price: '$0.99',
    interval: 'mo',
    requests: {
      price: `$${(deployment.amountPerRequest * 100).toFixed(2)} / call`,
      rateLimit: undefined
    },
    compute: {
      price: `$${(deployment.amountPerCompute * 100).toFixed(2)} / GB-s`,
      rateLimit: undefined
    },
    bandwidth: {
      price: `$${(deployment.amountPerBandwidth * 100).toFixed(2)} / GB`,
      rateLimit: undefined
    }
  }
]
