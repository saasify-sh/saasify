import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

import {
  BackgroundSlideshow,
  LoginForm,
  Paper,
  NavHeader
} from 'components'

import styles from './styles.module.css'

@inject('auth')
@observer
export class LoginPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      return (
        <Redirect to='/dashboard' />
      )
    }

    return (
      <div className={styles.container}>
        <BackgroundSlideshow />

        <NavHeader fixed={true} />

        <Paper className={styles.content}>
          <LoginForm />
        </Paper>
      </div>
    )
  }
}
