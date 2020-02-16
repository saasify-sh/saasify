import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'

import codingImage from '../../assets/delesign/coding.svg'
import startupImage from '../../assets/delesign/startup.svg'
import stripeImage from '../../assets/delesign/stripe.svg'

import styles from './styles.module.css'

export class HowItWorksSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='how-it-works'
        title='How It Works'
        className={theme(styles, 'how-it-works', className)}
        {...rest}
      >
        <div className={theme(styles, 'steps')}>
          <div className={theme(styles, 'step')}>
            <div>
              <h3>1. Create an API</h3>

              <p>
                We support any REST API built with any web framework. Just give
                us your API endpoints and some pricing info and Saasify
                generates a full SaaS product from there.
              </p>
            </div>

            <img alt='Coding' src={codingImage} />
          </div>

          <div className={theme(styles, 'step')}>
            <img alt='Launch' src={startupImage} />

            <div>
              <h3>2. Launch with Saasify</h3>

              <p>
                We generate an API proxy that tracks usage via Stripe. We also
                generate a polished, customizable marketing website that handles
                user accounts, billing, subscriptions, and developer-friendly
                docs. 💪
              </p>
            </div>
          </div>

          <div className={theme(styles, 'step')}>
            <div>
              <h3>3. Earn passive income</h3>

              <p>
                We'll help you market your new SaaS API, and you'll receive
                payouts each month via Stripe Connect or PayPal. We also help
                with support requests so you can focus on what you do best.
              </p>
            </div>

            <img alt='Profit' src={stripeImage} />
          </div>
        </div>
      </Section>
    )
  }
}
