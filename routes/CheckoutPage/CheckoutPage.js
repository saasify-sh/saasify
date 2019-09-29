import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { withRouter, Redirect } from 'react-router-dom'
import { notification } from 'lib/antd'
import { observer, inject } from 'mobx-react'

import plans from 'lib/pricing-plans'

import {
  PricingPlan,
  BackgroundSlideshow,
  CheckoutForm,
  Paper,
  NavHeader
} from 'components'

import API from 'lib/api'
import deployment from 'lib/deployment'

import styles from './styles.module.css'

@withRouter
@inject('auth')
@observer
export class CheckoutPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    loading: false
  }

  render() {
    const { auth } = this.props
    const { loading } = this.state

    if (auth.isAuthenticated && auth.consumer && auth.consumer.enabled) {
      return (
        <Redirect
          to='/dashboard'
        />
      )
    }

    const unlimited = plans.find(({ key }) => key === 'unlimited')

    return (
      <div className={theme(styles, 'checkout-page')}>
        <BackgroundSlideshow />

        <NavHeader fixed />

        <div className={theme(styles, 'content')}>
          <PricingPlan
            plan={unlimited}
            inline
          />

          <Paper className={theme(styles, 'checkout-form')}>
            <CheckoutForm
              title='Checkout'
              action='SUBSCRIBE'
              loading={loading}
              onSubmit={this._onSubmit}
            />
          </Paper>
        </div>
      </div>
    )
  }

  _onSubmit = async ({ name, stripe }) => {
    this.setState({ loading: true })

    try {
      const { token, error } = await stripe.createToken({ name })
      console.log({ token, error })

      if (error) {
        notification.error({
          message: 'Error processing payment method',
          description: error.message,
          duration: 0
        })
        this.setState({ loading: false })
        return
      }

      const source = await API.addBillingSource({ source: token.id })
      console.log('checkout source', { source })
      const consumer = await API.createConsumer({
        project: deployment.project.id,
        deployment: deployment.id
      })
      console.log('checkout consumer', { source, consumer })

      notification.success({
        message: 'Subscription Created',
        description: 'Your subscription has been created successfully. You may now use your auth token in API requests.'
      })

      this.props.auth.consumer = consumer
      this.props.history.replace('/dashboard?success=true')
    } catch (err) {
      notification.error({
        message: 'Error initializing subscription',
        description: err.error && err.error.message,
        duration: 0
      })

      this.setState({ loading: false })
    }
  }
}
