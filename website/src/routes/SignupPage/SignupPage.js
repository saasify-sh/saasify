import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { handleAuth, theme } from 'react-saasify'

import { SignupForm, Paper, NavHeader } from 'components'

import { authConfig } from 'lib/auth-config'

import styles from './styles.module.css'

@inject('auth')
@withRouter
@observer
export class SignupPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      return handleAuth(this.props)
    }

    return (
      <div className={theme(styles, 'signup-page')}>
        <NavHeader fixed />

        <div className={theme(styles, 'content')}>
          <Paper className={theme(styles, 'body')}>
            <SignupForm onAuth={this._onAuth} authConfig={authConfig} />
          </Paper>
        </div>
      </div>
    )
  }

  _onAuth = () => {
    // TODO: this will be a no-op here as it returns jsx
    handleAuth(this.props)
  }
}
