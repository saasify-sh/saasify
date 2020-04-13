import React, { Component } from 'react'
import cs from 'classnames'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import {
  Button,
  API,
  Icon,
  Spin,
  Statistic,
  Switch,
  notification
} from 'react-saasify'
import { TabPane } from 'components'

import styles from './styles.module.css'

@inject('auth')
@observer
export class StripeTabPane extends Component {
  @observable
  _loading = false

  @observable
  _loadingUser = false

  @observable
  _user = false

  @observable
  _account = null

  componentDidMount() {
    this._reset()
  }

  render() {
    const { auth } = this.props
    const user = this._user || auth.user

    const stripeProvider = user.providers?.stripe

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
        <h4 className={styles.h4}>Stripe Connect{accountLabel}</h4>

        {stripeProvider ? (
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

                  <div className={styles.detail}>
                    <p>
                      <Icon
                        type='check-circle'
                        theme='twoTone'
                        twoToneColor='#52c41a'
                        style={{ fontSize: '1.6em', marginRight: '12px' }}
                      />
                      Your Stripe Connect{accountLabel} is enabled and ready to
                      use.
                    </p>

                    <p>
                      <Icon
                        style={{ fontSize: '1.6em', marginRight: '12px' }}
                        type={
                          user.isStripeConnectEnabledByDefault
                            ? 'check-circle'
                            : 'close-circle'
                        }
                        theme='twoTone'
                        twoToneColor={
                          user.isStripeConnectEnabledByDefault
                            ? '#52c41a'
                            : '#1790FF'
                        }
                      />
                      Automatically link new projects to your connected Stripe
                      account?
                      <Switch
                        style={{ marginLeft: '12px' }}
                        checked={user.isStripeConnectEnabledByDefault}
                        loading={this._loadingUser}
                        onChange={this._onChangeIsStripeConnectEnabledByDefault}
                      />
                    </p>

                    <p>
                      Note that you can enable or disable Stripe Connect on a
                      per-project basis via its project admin settings page. You
                      must be a project owner in order to change Stripe
                      settings.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className={styles.detail}>
            <p>
              In order to customize your maker settings, please first link with
              Stripe connect via the{' '}
              <Link to='/account/integrations'>Integrations</Link> tab.
            </p>
          </div>
        )}
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
        const [account, user] = await Promise.all([
          API.getBillingAccount(),
          API.getMe()
        ])

        this._account = account
        this._user = user
      } catch (err) {
        console.error(err)

        notification.error({
          message: 'Error loading account',
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

  _onChangeIsStripeConnectEnabledByDefault = async (isEnabled) => {
    this._loadingUser = true

    try {
      const user = await API.updateMe({
        isStripeConnectEnabledByDefault: !!isEnabled
      })

      this._user = user
    } catch (err) {
      console.error(err)

      notification.error({
        message: 'Error updating account',
        description: err?.response?.data?.error || err.message,
        duration: 0
      })
    } finally {
      this._loadingUser = false
    }
  }
}
