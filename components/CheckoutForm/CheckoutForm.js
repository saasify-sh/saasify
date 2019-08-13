import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import { withRouter } from 'react-router-dom'
import { CardElement, injectStripe } from 'react-stripe-elements'

import {
  Button,
  Icon,
  Tooltip,
  notification
} from 'antd'

import AuthManager from 'store/AuthManager'
import API from 'lib/api'
import project from 'project.json'

import styles from './styles.module.css'

const createOptions = (fontSize = 16, padding = 8) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

@withRouter
@injectStripe
export class CheckoutForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    stripe: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  state = {
    loading: false
  }

  render() {
    const { className } = this.props
    const { loading } = this.state

    return (
      <form
        className={cs(styles.form, className)}
        onSubmit={this._onSubmit}
      >
        <h2 className={styles.title}>
          Checkout
        </h2>

        <label className={styles.label}>
          Email

          <input
            className={styles.input}
            name='email'
            type='text'
            defaultValue={AuthManager.user.email}
            required
          />
        </label>

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

        <Button
          type='primary'
          htmlType='submit'
          className={styles.submit}
          loading={loading}
        >
          SUBSCRIBE
        </Button>
      </form>
    )
  }

  _onSubmit = async (e) => {
    e.preventDefault()

    this.setState({ loading: true })

    try {
      const { token, error } = await this.props.stripe.createToken({
        name: e.target.name.value,
        email: e.target.email.value
      })

      console.log({ token, error })

      if (error) {
        notification.error({
          message: 'Error processing payment method',
          description: error.message
        })
        this.setState({ loading: false })
        return
      }

      const source = await API.addBillingSource({ source: token.id })
      console.log('checkout', { source })
      const consumer = await API.createConsumer({ project: project.id })
      console.log('checkout', { source, consumer })

      notification.success({
        message: 'Subscription Created',
        description: `Your subscription has been created successfully. You may now use your token "${consumer.token}" in API requests.`,
      })

      this.props.history.replace('/dashboard')
    } catch (err) {
      notification.error({
        message: 'Error initializing subscription',
        description: err.error && err.error.message
      })

      this.setState({ loading: false })
    }
  }
}
