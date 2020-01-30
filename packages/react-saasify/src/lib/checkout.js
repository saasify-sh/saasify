import React from 'react'

import { Redirect } from 'react-router-dom'

export function handleAuth({ auth, location }) {
  if (auth.isAuthenticated) {
    const params = new URLSearchParams(location.search)
    const plan = params.get('plan')

    if (plan) {
      return <Redirect to={`/checkout?plan=${plan}`} />
    } else {
      return <Redirect to='/dashboard' />
    }
  } else {
    return <Redirect to='/' />
  }
}
