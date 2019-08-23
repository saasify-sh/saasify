import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { handleAuth } from '../../lib/checkout'

import {
  BackgroundSlideshow,
  SignupForm,
  Paper,
  NavHeader
} from 'components'

import styles from './styles.module.css'

@inject('auth')
@withRouter
@observer
export class SignupPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      return handleAuth(this.props)
    }

    return (
      <div className={theme(styles, 'signup-page')}>
        <BackgroundSlideshow />

        <NavHeader fixed={true} />

        <Paper className={theme(styles, 'content')}>
          <SignupForm onAuth={this._onAuth} />
        </Paper>
      </div>
    )
  }

  _onAuth = () => {
    handleAuth(this.props)
  }
}
