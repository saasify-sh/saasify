import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

import { getPlansForProject } from 'lib/pricing-plans'

import {
  FinContext,
  PricingPlan,
  BackgroundSlideshow,
  CheckoutForm,
  Paper,
  NavHeader
} from 'components'

import API from 'lib/api'
import project from 'project.json'

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

    return (
      <FinContext.Consumer>
        {project => {
          const plans = getPlansForProject(project)
          const unlimited = plans.find(({ key }) => key === 'unlimited')

          return (
            <div className={styles.container}>
              <BackgroundSlideshow />

              <NavHeader fixed={true} />

              <div className={styles.content}>
                <PricingPlan
                  plan={unlimited}
                  inline
                />

                <Paper className={styles.checkoutForm}>
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
        }}
      </FinContext.Consumer>
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
      const consumer = await API.createConsumer({ project: project.id })
      console.log('checkout consumer', { source, consumer })

      notification.success({
        message: 'Subscription Created',
        description: `Your subscription has been created successfully. You may now use your auth token in API requests.`,
        duration: 10
      })

      this.props.history.replace('/dashboard')
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
