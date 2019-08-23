import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { handleAuth } from '../../lib/checkout'

import {
  BackgroundSlideshow,
  LoginForm,
  Paper,
  NavHeader
} from 'components'

import styles from './styles.module.css'

@inject('auth')
@withRouter
@observer
export class LoginPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      return handleAuth(this.props)
    }

    return (
      <div className={theme(styles, 'login-page')}>
        <BackgroundSlideshow />

        <NavHeader fixed={true} />

        <Paper className={theme(styles, 'content')}>
          <LoginForm onAuth={this._onAuth} />
        </Paper>
      </div>
    )
  }

  _onAuth = () => {
    handleAuth(this.props)
  }
}
