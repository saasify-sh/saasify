import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Paper, AuthProviders } from 'components'
import { TabPane } from '../TabPane'

import styles from './styles.module.css'

@observer
export class SettingsTabPane extends Component {
  render() {
    // const { project } = this.props

    return (
      <TabPane className={styles.body}>
        <Paper className={styles.content}>
          <AuthProviders
            authConfig={{
              github: {
                enabled: false
              },
              google: {
                enabled: false
              },
              spotify: {
                enabled: true
              },
              twitter: {
                enabled: true
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
                      <b>on behalf of your own Stripe account.</b> This is an
                      important feature that gives you full transparency and
                      control over all billing and financial aspects of your
                      SaaS products.
                    </p>

                    <p>
                      You can either link an existing Stripe account or create a
                      new one. Either way, you'll follow the same steps by
                      clicking the link above to get started.
                    </p>
                  </>
                )
              }
            }}
          />
        </Paper>
      </TabPane>
    )
  }
}
