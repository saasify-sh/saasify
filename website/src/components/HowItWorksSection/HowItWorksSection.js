import React, { Component } from 'react'

import {
  Section,
  theme
} from 'react-saasify'

import codingImage from '../../assets/delesign/coding.svg'
import startupImage from '../../assets/delesign/startup.svg'
import stripeImage from '../../assets/delesign/stripe.svg'

import styles from './styles.module.css'

export class HowItWorksSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        id='how-it-works'
        title='How It Works'
        className={theme(styles, 'how-it-works', className)}
        {...rest}
      >
        <div className={theme(styles, 'step')}>
          <div>
            <h3>
              1. Create a serverless function
            </h3>

            <p>
              Using TypeScript or Python, wrap your existing open source project in a serverless function.
            </p>
          </div>

          <img
            alt='Coding'
            src={codingImage}
          />
        </div>

        <div className={theme(styles, 'step')}>
          <img
            alt='Launch'
            src={startupImage}
          />

          <div>
            <h3>
              2. Deploy with Saasify
            </h3>

            <p>
              Deploy your project to AWS with our CLI. We autogenerate a customizable SaaS website for you that handles all billing, accounts, docs, hosting, and more.
            </p>
          </div>
        </div>

        <div className={theme(styles, 'step')}>
          <div>
            <h3>
              3. Earn passive income!
            </h3>

            <p>
              You collect 80% of all revenue your API makes via Stripe Connect. Saasify acts as a buffer between you and paying customers, taking care of all bizdev, marketing, and support requests, so you can focus on what you do best.
            </p>
          </div>

          <img
            alt='Profit'
            src={stripeImage}
          />
        </div>
      </Section>
    )
  }
}
