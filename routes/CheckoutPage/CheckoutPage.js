import React, { Component } from 'react'

import { StripeProvider, Elements } from 'react-stripe-elements'

import env from 'lib/env'
import { getPlansForProject } from 'lib/pricing-plans'

import {
  FinContext,
  PricingPlan,
  BackgroundSlideshow,
  CheckoutForm,
  Paper,
  NavHeader
} from 'components'

import styles from './styles.module.css'

export class CheckoutPage extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => {
          const plans = getPlansForProject(project)
          const unlimited = plans.find(({ key }) => key === 'unlimited')

          return (
            <StripeProvider apiKey={env.stripePublicKey}>
              <div className={styles.container}>
                <BackgroundSlideshow />

                <NavHeader fixed={true} />

                <div className={styles.content}>
                  <PricingPlan
                    plan={unlimited}
                    inline
                  />

                  <Paper className={styles.checkoutForm}>
                    <Elements>
                      <CheckoutForm />
                    </Elements>
                  </Paper>
                </div>
              </div>
            </StripeProvider>
          )
        }}
      </FinContext.Consumer>
    )
  }
}
