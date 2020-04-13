import React, { Component } from 'react'
import { theme } from 'react-saasify'
import { withRouter } from 'react-router'
import { withTracker } from 'lib/with-tracker'
import { observer } from 'mobx-react'
import { Route, Switch } from 'react-router-dom'

import {
  NavHeader,
  NavFooter,
  Paper,
  ScrollToTopOnMount,
  Section,
  TabBar
} from 'components'

import { StripeTabPane } from './StripeTabPane'
import { IntegrationsTabPane } from './IntegrationsTabPane'

import styles from './styles.module.css'

@withTracker
@withRouter
@observer
export class AccountPage extends Component {
  render() {
    const { match } = this.props

    const tabs = [
      {
        key: 'stripe',
        label: 'Stripe',
        to: match.url,
        icon: { type: 'setting' }
      },
      {
        key: 'integrations',
        label: 'Integrations',
        to: `${match.url}/integrations`,
        icon: { type: 'api' }
      }
    ]

    return (
      <div className={theme(styles, 'account-page')}>
        <ScrollToTopOnMount />

        <NavHeader />

        <Section
          id='account'
          title='Account'
          className={theme(styles, 'body')}
          contentClassName={theme(styles, 'content')}
        >
          <Paper className={theme(styles, 'paper')}>
            <TabBar tabs={tabs} />

            <Switch>
              <Route path={`${match.path}`} exact>
                <StripeTabPane />
              </Route>

              <Route path={`${match.path}/integrations`}>
                <IntegrationsTabPane />
              </Route>
            </Switch>
          </Paper>
        </Section>

        <NavFooter />
      </div>
    )
  }
}
