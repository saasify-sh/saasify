/**
 * @class AuthenticatedRoute
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { observer, inject } from 'mobx-react'
import { Redirect, Route } from 'react-router-dom'

import { Loading } from '../Loading'

@inject('auth')
@observer
export class AuthenticatedRoute extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      .isRequired,
    auth: PropTypes.object.isRequired,
    redirect: PropTypes.string
  }

  static defaultProps = {
    redirect: '/login'
  }

  render() {
    const { component: Component, redirect, auth, ...rest } = this.props

    if (auth.isBootstrapping) {
      return <Loading />
    }

    if (!auth.isAuthenticated) {
      return (
        <Redirect
          to={{
            pathname: redirect
          }}
        />
      )
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          auth.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: redirect,
                state: {
                  from: props.location
                }
              }}
            />
          )
        }
      />
    )
  }
}
