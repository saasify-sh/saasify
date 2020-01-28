export function getUpgradeLink({ auth, deployment }) {
  const { pricingPlans } = deployment

  if (auth.isAuthenticated) {
    if (pricingPlans.length === 2) {
      return `/chckout?plan=${pricingPlans[1].slug}`
    }
  }

  return '/pricing'
}
