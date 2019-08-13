import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StripeProvider, Elements } from 'react-stripe-elements'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

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

@inject('auth')
@observer
export class CheckoutPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const {
      auth
    } = this.props

    if (auth.isAuthenticated && auth.consumer && auth.consumer.enabled) {
      return (
        <Redirect
          to='/dashboard'
        />
      )
    }

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
