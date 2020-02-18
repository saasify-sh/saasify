import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { ScrollToTopOnMount } from 'components'

import styles from './styles.module.css'

export class OnboardingPage extends Component {
  render() {
    return (
      <div>
        <ScrollToTopOnMount />

        <iframe
          className={theme(styles, 'onboarding-page')}
          id='typeform-full'
          width='100%'
          height='100%'
          frameBorder='0'
          src='https://travisfischer.typeform.com/to/psuwXS'
        />

        <script
          type='text/javascript'
          src='https://embed.typeform.com/embed.js'
        />
      </div>
    )
  }
}
