import React, { Component } from 'react'
import cs from 'classnames'
import { observable, toJS } from 'mobx'
import { inject, observer } from 'mobx-react'

import {
  Button,
  Divider,
  API,
  Spin,
  Statistic,
  notification
} from 'react-saasify'
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
      <>
        <p style={{ marginTop: '1em' }}>
          Saasify uses{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://stripe.com/connect'
          >
            Stripe Connect
          </a>{' '}
          to handle subscription billing and payments{' '}
          <b>on behalf of your own Stripe account.</b> This is an important
          feature that gives you full transparency and control over all billing
          and financial aspects of your SaaS products.
        </p>

        <p>
          You can either link an existing Stripe account or create a new one.
          Either way, you'll follow the same steps by clicking the link above to
          get started.
        </p>
      </>
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
                  <>
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

                    <pre>{JSON.stringify(toJS(this._account), null, 2)}</pre>

                    {isExpress && (
                      <Button type='primary' onClick={this._onClickDashboard}>
                        View Stripe Dashboard
                      </Button>
                    )}
                  </>
                ) : null}
              </div>

              <Divider />
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
