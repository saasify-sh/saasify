import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CTAButton, theme } from 'react-saasify'

import { NavHeader, NavFooter, ScrollToTopOnMount, Section } from 'components'

import catImage from './cat-in-space.svg'

import styles from './styles.module.css'

export class EmailConfirmedPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'email-confirmed-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section id='email-confirmed' title='Email Confirmed'>
          <div className={theme(styles, 'body')}>
            <p>Great to have you onboard 😊</p>

            <p>
              We're really excited to help you get your SaaS ideas off the
              ground!
            </p>

            <p>The next step is to complete a quick onboarding survey.</p>

            <p>
              If you've already completed the survey, then hang tight and we'll
              be in touch with you shortly. You can always reach out to us
              directly via <a href='mailto:support@saasify.sh'>email</a> or via
              our <a href='https://slack.saasify.sh'>open Slack</a>.
            </p>
          </div>

          <Link key='onboarding' to='/onboarding'>
            <CTAButton>Continue Onboarding</CTAButton>
          </Link>

          <img
            src={catImage}
            alt='Cat in space'
            className={styles.illustration}
          />
        </Section>

        <NavFooter />
      </div>
    )
  }
}
