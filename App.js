import React, { Component } from 'react'

import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AuthenticatedRoute } from 'components/AuthenticatedRoute'

import { DashboardPage } from 'routes/DashboardPage'
import { HomePage } from 'routes/HomePage'
import { LoginPage } from 'routes/LoginPage'
import { AuthGitHubPage } from 'routes/AuthGitHubPage'

import AuthManager from 'store/AuthManager'

@observer
export default class App extends Component {
  render() {
    if (AuthManager.isBootstrapping) {
      return null
    }

    return (
      <Router>
        <Provider auth={AuthManager}>
          <Switch>
            <Route exact path='/' component={HomePage} />

            <Route path='/login' component={LoginPage} />
            <Route path='/auth/github' component={AuthGitHubPage} />

            <AuthenticatedRoute path='/dashboard' component={DashboardPage} />

            <Route render={() => (<div> TODO: 404 page </div>)} />
          </Switch>
        </Provider>
      </Router>
    )
  }
}
