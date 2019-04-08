import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

import { LoginForm } from 'components/LoginForm'

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
      <div>
        <p>Login Page</p>

        <LoginForm />
      </div>
    )
  }
}
