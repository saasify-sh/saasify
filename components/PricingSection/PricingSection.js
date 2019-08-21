import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { PricingPlan } from '../PricingPlan'

import { getPlansForProject } from 'lib/pricing-plans'

import styles from './styles.module.css'

export class PricingSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {({ project }) => {
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
                  <PricingPlan
                    key={plan.key}
                    plan={plan}
                  />
                ))}
              </div>
            </Section>
          )
        }}
      </FinContext.Consumer>
    )
  }
}
