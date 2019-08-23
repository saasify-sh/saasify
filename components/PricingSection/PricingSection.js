import React, { Component } from 'react'

import { Section } from '../Section'
import { PricingPlan } from '../PricingPlan'

import plans from 'lib/pricing-plans'
import theme from 'lib/theme'

import styles from './styles.module.css'

export class PricingSection extends Component {
  render() {
    return (
      <Section
        id='pricing'
        title='Pricing'
        subtitle={(
          <span>
            Free. Unlimited. <b>Pay as you Grow.</b>
          </span>
        )}
        stretch
        {...this.props}
      >
        <div className={theme(styles, 'plans')}>
          {plans.map((plan) => (
            <PricingPlan
              key={plan.key}
              plan={plan}
            />
          ))}
        </div>
      </Section>
    )
  }
}
