import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'
import { BenefitsAnimation } from './BenefitsAnimation/BenefitsAnimation'

import styles from './styles.module.css'

const ourBenefits = [
  'Stripe Subscription Billing',
  'User Accounts (auth, emails, acct management)',
  'API usage tracking',
  'Global API Caching',
  'Developer Docs',
  'Marketing Site'
]

const yourFocus = [
  'Building your product',
  'Building product features',
  'Making money'
]

export class BenefitsSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='benefits'
        contentClassName={theme(styles, 'benefits', className)}
        {...rest}
      >
        <BenefitsAnimation items={ourBenefits} title='Things that suck' />

        <BenefitsAnimation items={yourFocus} title='Things that are fun' />
      </Section>
    )
  }
}
