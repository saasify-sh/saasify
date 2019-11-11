import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import {
  StripeProvider,
  Elements,
  CardElement,
  injectStripe
} from 'react-stripe-elements'

import { Button, Icon, Tooltip } from 'lib/antd'
import env from 'lib/env'

import { SaasifyContext } from '../SaasifyContext'

import styles from './styles.module.css'

const createOptions = (fontSize = 16) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

export class CheckoutForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    action: PropTypes.node,
    className: PropTypes.string
  }

  render() {
    return (
      <SaasifyContext.Consumer>
        {(config) => (
          <StripeProvider apiKey={env.stripePublicKey}>
            <Elements>
              <CheckoutFormImpl {...this.props} config={config} />
            </Elements>
          </StripeProvider>
        )}
      </SaasifyContext.Consumer>
    )
  }
}

@injectStripe
class CheckoutFormImpl extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    stripe: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    action: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    loading: false
  }

  render() {
    const { config, loading, title, action, className } = this.props

    return (
      <form
        className={theme(styles, 'form', className, theme(styles, 'light'))}
        onSubmit={this._onSubmit}
      >
        {title && <h2 className={theme(styles, 'title')}>{title}</h2>}

        <label className={theme(styles, 'label')}>
          Name
          <input
            className={theme(styles, 'input')}
            name='name'
            type='text'
            placeholder='John Doe'
            required
          />
        </label>

        <label className={theme(styles, 'label')}>
          Card Details
          <Tooltip
            placement='right'
            title='All payment info is securely handled by Stripe.'
          >
            <Icon className={theme(styles, 'detail')} type='question-circle' />
          </Tooltip>
          <CardElement {...createOptions()} />
        </label>

        {config.coupons && config.coupons.length > 0 && (
          <label className={theme(styles, 'label')}>
            Promo Code
            <input
              className={theme(styles, 'input')}
              name='coupon'
              type='text'
              placeholder=''
            />
          </label>
        )}

        {action && (
          <Button
            type='primary'
            htmlType='submit'
            className={theme(styles, 'submit')}
            loading={loading}
          >
            {action}
          </Button>
        )}
      </form>
    )
  }

  _onSubmit = async (e) => {
    e.preventDefault()

    const name = e.target.name.value
    const coupon = e.target.coupon && e.target.coupon.value
    this.props.onSubmit({ name, coupon, stripe: this.props.stripe })
  }
}
