import React, { Component } from 'react'

import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import {
  AuthenticatedRoute,
  FinContext
} from './components'

import {
  DashboardPage,
  HomePage,
  PricingPage,
  DocsPage,
  APIPage,
  LoginPage,
  LogoutPage,
  SignupPage,
  CheckoutPage,
  TermsPage,
  PrivacyPage,
  AuthGitHubPage,
  NotFoundPage
} from './routes'

import AuthManager from './store/AuthManager'
import deployment from './lib/deployment'

@observer
export default class App extends Component {
  render() {
    if (AuthManager.isBootstrapping) {
      return null
    }

    return (
      <Router>
        <Provider auth={AuthManager}>
          <FinContext.Provider value={deployment}>
            <Switch>
              <Route exact path='/' component={HomePage} />

              <Route path='/pricing' component={PricingPage} />

              <Route path='/docs/api' component={APIPage} />
              <Route path='/docs' component={DocsPage} />

              <Route path='/terms' component={TermsPage} />
              <Route path='/privacy' component={PrivacyPage} />

              <Route path='/login' component={LoginPage} />
              <Route path='/signup' component={SignupPage} />
              <Route path='/auth/github' component={AuthGitHubPage} />

              <AuthenticatedRoute path='/dashboard' component={DashboardPage} />
              <AuthenticatedRoute path='/checkout' component={CheckoutPage} />
              <AuthenticatedRoute path='/logout' component={LogoutPage} />

              <Route component={NotFoundPage} />
            </Switch>
          </FinContext.Provider>
        </Provider>
      </Router>
    )
  }
}
