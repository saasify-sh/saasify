import React, { Component } from 'react'

import { Redirect } from 'react-router-dom'

import AuthManager from 'store/AuthManager'

export class LogoutPage extends Component {
  componentDidMount() {
    AuthManager.signout()
  }

  render() {
    return (
      <Redirect to='/' />
    )
  }
}
