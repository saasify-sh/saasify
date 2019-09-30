import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { withRouter, Redirect } from 'react-router-dom'
import { notification } from 'lib/antd'
import { observer, inject } from 'mobx-react'

import plans from 'lib/pricing-plans'
import theme from 'lib/theme'

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

  _onSubmit = async ({ name, coupon, stripe }) => {
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
        deployment: deployment.id,
        coupon
      })
      console.log('checkout consumer', { source, consumer })

      const activeCoupon = coupon && (
        (deployment.coupons || []).find((c) => c.id === coupon)
      )

      if (activeCoupon) {
        // TODO: check if activeCoupon is valid
        console.log('active coupon', activeCoupon)
      }

      notification.success({
        message: 'Subscription Created',
        description: 'Your subscription has been created successfully. You may now use your auth token in API requests.'
      })

      this.props.auth.consumer = consumer
      const querystring = qs.stringify({ success: true, coupon })
      this.props.history.replace(`/dashboard?${querystring}`)
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
