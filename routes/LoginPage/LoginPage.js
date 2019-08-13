import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
      <div className={styles.container}>
        <BackgroundSlideshow />

        <NavHeader fixed={true} />

        <Paper className={styles.content}>
          <LoginForm onAuth={this._onAuth} />
        </Paper>
      </div>
    )
  }

  _onAuth = () => {
    handleAuth(this.props)
  }
}
