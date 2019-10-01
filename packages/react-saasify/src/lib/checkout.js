import React from 'react'

import { Redirect } from 'react-router-dom'

/*
const startCheckout = async () => {
  const publicKey = (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST

  const session = await API.createCheckoutSession({ project: project.id })
  const stripe = window.Stripe(publicKey)

  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  })

  console.log('checkout result', result)

  if (result.error) {
    notifications.error(result.error.message)
  }
}
*/

export function handleAuth({ auth, location }) {
  if (auth.isAuthenticated) {
    const params = new URLSearchParams(location.search)
    const plan = params.get('plan')

    if (plan === 'unlimited') {
      return (
        <Redirect to={`/checkout?plan=${plan}`} />
      )
    } else {
      return (
        <Redirect to='/dashboard' />
      )
    }
  }
}
