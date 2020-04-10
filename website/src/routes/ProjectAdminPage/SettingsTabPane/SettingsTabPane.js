import React, { Component } from 'react'
import cs from 'classnames'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'

import { Button, API, Icon, Spin, Statistic, notification } from 'react-saasify'
import { Paper, AuthProviders } from 'components'
import { TabPane } from '../TabPane'

import styles from './styles.module.css'

const authConfig = {
  github: {
    enabled: false
  },
  google: {
    enabled: false
  },
  spotify: {
    enabled: false
  },
  twitter: {
    enabled: false
  },
  stripe: {
    enabled: true,
    type: 'primary',
    detail: (
      <div className={styles.detail}>
        <p>
          Saasify uses{' '}
          <b>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://stripe.com/connect'
            >
              Stripe Connect
            </a>
          </b>{' '}
          to enable subscription billing{' '}
          <b>on behalf of your own Stripe account</b>. This is an important
          feature that gives you full control over all subscription and billing
          aspects of your products including customer data.
        </p>

        <p>
          Saasify uses{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://stripe.com/connect/account-types#standard'
          >
            <b>Standard</b> Stripe Connect Accounts
          </a>
          . This means that you'll link your own external Stripe account with
          Saasify. This gives you the most control and flexibility over your
          product's revenue and subscriptions. It also makes it easy to disable
          your Saasify integration at any point.
        </p>

        <p>
          <b>Click the Stripe Connect button above to get started</b>. If you
          already have an existing Stripe account, you will be prompted to
          connect with Saasify. Otherwise, Stripe will walk you through the
          fairly simple process of setting up a new <b>free</b> Standard Stripe
          Account.
        </p>

        <p>
          Our{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://docs.saasify.sh/#/support'
          >
            support team
          </a>{' '}
          will be happy to answer any questions you may have around setting up
          this integration as a key step in your product's go-to-market process.
        </p>
      </div>
    )
  }
}

@inject('auth')
@observer
export class SettingsTabPane extends Component {
  @observable
  _loading = false

  @observable
  _account = null

  componentDidMount() {
    this._reset()
  }

  render() {
    const { auth } = this.props

    const stripeProvider = auth.user.providers?.stripe

    let accountLabel = ''
    let isExpress = false
    let availableBalance = 0
    let pendingBalance = 0

    if (stripeProvider) {
      isExpress = stripeProvider.scope === 'express'

      accountLabel = ` ${isExpress ? 'Express' : 'Standard'} Account`
    }

    if (this._account) {
      const { balance } = this._account
      availableBalance = balance.available[0].amount
      pendingBalance = balance.pending[0].amount
    }

    return (
      <TabPane className={styles.body}>
        <Paper className={styles.content}>
          <h4 className={styles.h4}>Stripe Connect{accountLabel}</h4>

          {stripeProvider && (
            <>
              <div>
                {this._loading ? (
                  <Spin />
                ) : this._account ? (
                  <div>
                    <div className={styles.metrics}>
                      <div className={cs(styles.metric, styles.activeMetric)}>
                        <h4 className={styles.label}>Available Balance</h4>

                        <Statistic
                          precision={2}
                          prefix='$'
                          value={availableBalance}
                        />
                      </div>

                      <div className={cs(styles.metric, styles.activeMetric)}>
                        <h4 className={styles.label}>Pending Balance</h4>

                        <Statistic
                          precision={2}
                          prefix='$'
                          value={pendingBalance}
                        />
                      </div>
                    </div>

                    {isExpress && (
                      <Button type='primary' onClick={this._onClickDashboard}>
                        View Stripe Dashboard
                      </Button>
                    )}

                    <p>
                      <Icon
                        type='check-circle'
                        theme='twoTone'
                        twoToneColor='#52c41a'
                      />{' '}
                      Your Stripe Connect{accountLabel} is enabled and ready to
                      use. All new Saasify products you create will be
                      automatically linked to your connected Stripe account.
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}

          <AuthProviders authConfig={authConfig} />
        </Paper>
      </TabPane>
    )
  }

  async _reset() {
    const { auth } = this.props

    const stripeProvider = auth.user.providers?.stripe

    if (stripeProvider) {
      this._loading = true
      this._account = null

      try {
        this._account = await API.getBillingAccount()
      } catch (err) {
        console.error(err)

        notification.error({
          message: 'Error loading account balance',
          description: err?.response?.data?.error || err.message,
          duration: 0
        })
      } finally {
        this._loading = false
      }
    }
  }

  _onClickDashboard = async () => {
    try {
      const { url } = await API.getBillingDashboard()
      window.location = url
    } catch (err) {
      console.error(err)

      notification.error({
        message: 'Error connecting to Stripe Connect dashboard',
        description: err?.response?.data?.error || err.message,
        duration: 0
      })
    }
  }
}
