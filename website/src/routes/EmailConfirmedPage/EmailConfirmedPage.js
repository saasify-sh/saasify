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

            <p>
              We recommend that you get started with our{' '}
              <a href='https://docs.saasify.sh'>quick start guide</a>.
            </p>

            <p>
              Feel free to reach out to us directly via{' '}
              <a href='mailto:support@saasify.sh'>email</a> or via our{' '}
              <a
                href='https://slack.saasify.sh'
                target='_blank'
                rel='noopener noreferrer'
              >
                open Slack
              </a>
              .
            </p>
          </div>

          <div className={styles.actions}>
            <a href='https://docs.saasify.sh' className={styles.action}>
              <CTAButton>Quick Start Guide</CTAButton>
            </a>

            <Link to='/onboarding' className={styles.action}>
              <CTAButton>Onboarding Survey</CTAButton>
            </Link>
          </div>

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
