import React, { Component } from 'react'

import { StripeProvider, Elements } from 'react-stripe-elements'

import env from 'lib/env'

import {
  BackgroundSlideshow,
  CheckoutForm,
  Paper,
  NavHeader
} from 'components'

import styles from './styles.module.css'

export class CheckoutPage extends Component {
  render() {
    return (
      <StripeProvider apiKey={env.stripePublicKey}>
        <div className={styles.container}>
          <BackgroundSlideshow />

          <NavHeader fixed={true} />

          <Paper className={styles.content}>
            <Elements>
              <CheckoutForm />
            </Elements>
          </Paper>
        </div>
      </StripeProvider>
    )
  }
}
