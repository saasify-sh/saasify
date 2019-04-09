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
  LoginPage,
  TermsPage,
  PrivacyPage,
  AuthGitHubPage
} from './routes'

import AuthManager from './store/AuthManager'
import FinProject from './project.json'

@observer
export default class App extends Component {
  render() {
    if (AuthManager.isBootstrapping) {
      return null
    }

    return (
      <Router>
        <Provider auth={AuthManager}>
          <FinContext.Provider value={FinProject}>
            <Switch>
              <Route exact path='/' component={HomePage} />

              <Route path='/terms' component={TermsPage} />
              <Route path='/privacy' component={PrivacyPage} />

              <Route path='/login' component={LoginPage} />
              <Route path='/auth/github' component={AuthGitHubPage} />

              <AuthenticatedRoute path='/dashboard' component={DashboardPage} />

              <Route render={() => (<div> TODO: 404 page </div>)} />
            </Switch>
          </FinContext.Provider>
        </Provider>
      </Router>
    )
  }
}
