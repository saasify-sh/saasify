import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { AuthProviders, TabPane } from 'components'

import styles from './styles.module.css'

const authConfig = {
  github: {
    enabled: true
  },
  google: {
    enabled: true
  },
  spotify: {
    enabled: true
  },
  linkedin: {
    enabled: true
  },
  twitter: {
    enabled: true
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
          Saasify. This gives you the most flexibility and control over your
          product's billing details. It also makes it easy to disable your
          Saasify integration at any point since your Stripe account is
          completely isolated from Saasify's Stripe account.
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
          will be happy to answer any questions you may have, as this
          integration is a key step in your product's go-to-market process.
        </p>
      </div>
    )
  }
}

@observer
export class IntegrationsTabPane extends Component {
  render() {
    return (
      <TabPane className={styles.body}>
        <h4 className={styles.h4}>Integrations</h4>

        <AuthProviders authConfig={authConfig} />
      </TabPane>
    )
  }
}
