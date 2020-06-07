import React from 'react'

import { Redirect } from 'react-router-dom'

export function handleAuth({ auth, href }) {
  console.log('handleAuth', auth.isAuthenticated, { href })

  if (auth.isAuthenticated) {
    try {
      const url = new URL(href || window.location.href)
      const plan = url.searchParams.get('plan')

      if (plan) {
        return <Redirect to={`/checkout?plan=${plan}`} />
      } else {
        return <Redirect to='/dashboard' />
      }
    } catch (err) {
      return <Redirect to='/dashboard' />
    }
  } else {
    return <Redirect to='/' />
  }
}
