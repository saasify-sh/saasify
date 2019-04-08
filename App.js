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
  AuthGitHubPage
} from './routes'

import AuthManager from './store/AuthManager'

@observer
export default class App extends Component {
  render() {
    if (AuthManager.isBootstrapping) {
      return null
    }

    return (
      <Router>
        <Provider auth={AuthManager}>
          <FinContext.Provider value={process.env.REACT_APP_FIN_PROJECT}>
            <Switch>
              <Route exact path='/' component={HomePage} />

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
