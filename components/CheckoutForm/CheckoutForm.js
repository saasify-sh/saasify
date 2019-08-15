import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import {
  StripeProvider,
  Elements,
  CardElement,
  injectStripe
} from 'react-stripe-elements'

import {
  Button,
  Icon,
  Tooltip
} from 'antd'

import { FinContext } from '../FinContext'
import env from 'lib/env'

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
      <FinContext.Consumer>
        {project => (
          <StripeProvider apiKey={env.stripePublicKey}>
            <Elements>
              <CheckoutFormImpl
                {...this.props}
              />
            </Elements>
          </StripeProvider>
        )}
      </FinContext.Consumer>
    )
  }
}

@injectStripe
class CheckoutFormImpl extends Component {
  static propTypes = {
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
    const { loading, title, action, className } = this.props

    return (
      <form
        className={cs(styles.form, className)}
        onSubmit={this._onSubmit}
      >
        {title && (
          <h2 className={styles.title}>
            {title}
          </h2>
        )}

        <label className={styles.label}>
          Name

          <input
            className={styles.input}
            name='name'
            type='text'
            placeholder='John Doe'
            required
          />
        </label>

        <label className={styles.label}>
          Card Details

          <Tooltip
            placement='right'
            title='All payment info is securely handled by Stripe.'
          >
            <Icon
              className={styles.detail}
              type='question-circle'
            />
          </Tooltip>

          <CardElement
            {...createOptions()}
          />
        </label>

        {action && (
          <Button
            type='primary'
            htmlType='submit'
            className={styles.submit}
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
    this.props.onSubmit({ name, stripe: this.props.stripe })
  }
}
