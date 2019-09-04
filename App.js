import React, { Component } from 'react'

import { toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import BodyClassName from 'react-body-classname'

import {
  AuthenticatedRoute,
  SaasifyContext
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
import ThemeManager from './store/ThemeManager'
import deployment from './lib/deployment'

@observer
export default class App extends Component {
  render() {
    if (AuthManager.isBootstrapping) {
      return null
    }

    const { saas } = deployment.project

    const fonts = toJS(ThemeManager.theme.fonts)
    console.log(fonts)

    return (
      <Router>
        <Provider auth={AuthManager}>
          <SaasifyContext.Provider value={deployment}>
            <Helmet>
              <title>{saas.name}</title>

              {saas.logo && (
                <link rel='shortcut icon' href={saas.logo} />
              )}

              {fonts && (
                fonts.map((font) => (
                  <link
                    key={font}
                    href={`https://fonts.googleapis.com/css?family=${font}&display=swap`}
                    rel='stylesheet'
                  />
                ))
              )}
            </Helmet>

            <BodyClassName
              className={`theme-${ThemeManager.theme['@name']}`}
            >
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
            </BodyClassName>
          </SaasifyContext.Provider>
        </Provider>
      </Router>
    )
  }
}
