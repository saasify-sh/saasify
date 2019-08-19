export const getPlansForProject = (project) => {
  const { noAuthRateLimit } = project.deployment
  let requestsRateLimit

  if (noAuthRateLimit && noAuthRateLimit.enabled) {
    const requestsIntervalLabel = intervalToLabel(noAuthRateLimit.requestsInterval)
    requestsRateLimit = `${noAuthRateLimit.requestsMaxPerInterval} / ${requestsIntervalLabel}`
  }

  return [
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
        rateLimit: undefined
      },
      bandwidth: {
        price: '$0 / GB',
        rateLimit: '100 GB / mo'
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
        price: `$${project.deployment.amountPerRequest} / call`,
        rateLimit: undefined
      },
      compute: {
        price: `$${project.deployment.amountPerCompute} / GB-s`,
        rateLimit: undefined
      },
      bandwidth: {
        price: `$${project.deployment.amountPerBandwidth} / GB`,
        rateLimit: undefined
      }
    }
  ]
}

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
      return 'week'
    default:
      return `${intervalS} seconds`
  }
}
