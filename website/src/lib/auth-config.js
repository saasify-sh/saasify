import React from 'react'
import { DialogManager } from './DialogManager'

export const authConfig = {
  github: {
    enabled: true
  },
  google: {
    enabled: false
  },
  spotify: {
    enabled: false
  },
  linkedin: {
    enabled: false
  },
  twitter: {
    enabled: false
  },
  stripe: {
    enabled: false
  },
  orSignup: (
    <span>
      Don't have an account?{' '}
      <a
        href='#'
        onClick={() => {
          DialogManager.isSignupDialogOpen = true
        }}
      >
        Request Access
      </a>
      .
    </span>
  ),
  postBody: (
    <p style={{ marginTop: '1em' }}>
      Saasify is currently in open beta, and access to the maker admin dashboard
      is invite-only at this time.
    </p>
  )
}
