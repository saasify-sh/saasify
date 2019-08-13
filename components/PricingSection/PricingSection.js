import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { PricingPlan } from '../PricingPlan'

import styles from './styles.module.css'

const getPlansForProject = (project) => [
  {
    name: 'Free',
    key: 'free',
    type: 'secondary',
    desc: 'FREE FOREVER',
    price: '$0.00',
    interval: 'mo',
    requests: {
      price: '$0.0004 / call',
      rateLimit: 'N / day' // TODO
    },
    compute: {
      price: '$0 / s',
      rateLimit: undefined
    },
    bandwidth: {
      price: '$0 / GB',
      rateLimit: '100 GB / mo'
    }
  },
  {
    name: 'Unlimited',
    key: 'unlimited',
    type: 'primary',
    desc: 'STARTING AT',
    price: '$0.99',
    interval: 'mo',
    requests: {
      price: '$0 / call',
      rateLimit: undefined
    },
    compute: {
      price: '$0.0034 / s',
      rateLimit: undefined
    },
    bandwidth: {
      price: '$0.2 / GB',
      rateLimit: undefined
    }
  }
]

export class PricingSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => {
          const plans = getPlansForProject(project)

          return (
            <Section
              title='Pricing'
              subtitle={(
                <span>
                  Free. Unlimited. <b>Pay as you Grow.</b>
                </span>
              )}
              stretch
              {...this.props}
            >
              <div className={styles.plans}>
                {plans.map((plan) => (
                  <PricingPlan plan={plan} />
                ))}
              </div>
            </Section>
          )
        }}
      </FinContext.Consumer>
    )
  }
}
