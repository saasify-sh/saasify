import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StripeProvider, Elements } from 'react-stripe-elements'

import env from 'lib/env'

import { FinContext } from '../FinContext'
import { CheckoutForm } from '../CheckoutForm'

// TODO: refactor this to be CheckoutForm and move CheckoutForm to CheckoutFormImpl oder etwas

export class CheckoutSection extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    action: PropTypes.node,
    className: PropTypes.string
  }

  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <StripeProvider apiKey={env.stripePublicKey}>
            <Elements>
              <CheckoutForm
                {...this.props}
              />
            </Elements>
          </StripeProvider>
        )}
      </FinContext.Consumer>
    )
  }
}
