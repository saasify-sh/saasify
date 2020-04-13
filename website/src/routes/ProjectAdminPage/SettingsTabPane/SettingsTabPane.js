import React, { Component } from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import { API, Icon, Spin, Switch, notification } from 'react-saasify'
import { TabPane } from 'components'

import styles from './styles.module.css'

@inject('auth')
@observer
export class SettingsTabPane extends Component {
  @observable
  _loading = false

  @observable
  _loadingProject = false

  @observable
  _user = false

  @observable
  _project = null

  componentDidMount() {
    this._reset()
  }

  render() {
    const { auth } = this.props
    const project = this._project || this.props.project
    const user = this._user || auth.user

    const stripeProvider = user.providers?.stripe

    let accountLabel = ''
    let isExpress = false

    if (stripeProvider) {
      isExpress = stripeProvider.scope === 'express'

      accountLabel = ` ${isExpress ? 'Express' : 'Standard'} Account`
    }

    return (
      <TabPane className={styles.body}>
        <h4 className={styles.h4}>Stripe Connect{accountLabel}</h4>

        {stripeProvider && (
          <>
            <div>
              {this._loading ? (
                <Spin />
              ) : project ? (
                <div>
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
                        project.isStripeConnectEnabled
                          ? 'check-circle'
                          : 'close-circle'
                      }
                      theme='twoTone'
                      twoToneColor={
                        project.isStripeConnectEnabled ? '#52c41a' : '#1790FF'
                      }
                    />
                    Enable Stripe Connect for this project?
                    <Switch
                      style={{ marginLeft: '12px' }}
                      checked={project.isStripeConnectEnabled}
                      loading={this._loadingProject}
                      onChange={this._onChangeIsStripeConnectEnabled}
                    />
                  </p>

                  <p>
                    You can access your Stripe Connect account from your{' '}
                    <Link to='/account'>Account</Link> page.
                  </p>
                </div>
              ) : (
                <div className={styles.detail}>
                  <p>
                    In order to enable Stripe, please first enable the Stripe
                    Connect integration on the{' '}
                    <Link to='/account/integrations'>Account Integrations</Link>{' '}
                    page.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </TabPane>
    )
  }

  async _reset() {
    this._loading = true

    try {
      const [project, user] = await Promise.all([
        API.getProject(this.props.project.id),
        API.getMe()
      ])

      this._project = project
      this._user = user
    } catch (err) {
      console.error(err)

      notification.error({
        message: 'Error loading settings',
        description: err?.response?.data?.error || err.message,
        duration: 0
      })
    } finally {
      this._loading = false
    }
  }

  _onChangeIsStripeConnectEnabled = async (isEnabled) => {
    if (!isEnabled) {
      notification.warn({
        message: 'Unable to disable Stripe Connect',
        description:
          'Disabling Stripe Connect on a per-project basis is currently not supported. Please contact support if you need this functionality.',
        duration: 0
      })
      return
    }

    this._loadingProject = true

    try {
      const project = await API.enableStripeConnectForProject(
        this._project || this.props.project
      )

      if (project.isStripeConnectEnabled) {
        notification.success({
          message: 'Stripe Connect Enabled',
          description:
            'Stripe Connect has been enabled for this project. All subscriptions and customers will be created on your connected Stripe account.',
          duration: 10
        })
      }

      this._project = project
    } catch (err) {
      console.error(err)

      notification.error({
        message: 'Error enabling Stripe Connect',
        description: err?.response?.data?.error || err.message,
        duration: 0
      })
    } finally {
      this._loadingProject = false
    }
  }
}
