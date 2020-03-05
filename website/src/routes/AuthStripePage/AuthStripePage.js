import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { observer, inject } from 'mobx-react'
import { Redirect, withRouter } from 'react-router-dom'
import { debug, notification } from 'react-saasify'

@withRouter
@inject('auth')
@observer
export class AuthGitHubPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    loading: true,
    pathname: '/dashboard'
  }

  componentDidMount() {
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    })

    if (!query.code) {
      notification.error({
        message: 'Error authenticating with Stripe'
      })
      this.setState({ loading: false })
      return
    }

    if (query.state) {
      this.setState({
        pathname: query.state
      })
    }

    this.props.auth
      .authWithGitHub({
        code: query.code
      })
      .then(
        () => {
          this.setState({ loading: false })
        },
        (err) => {
          this.setState({ loading: false })

          debug(err)
          notification.error({
            message: 'Error authenticating with Stripe',
            description: err?.response?.data?.error || err.message
          })
        }
      )
  }

  render() {
    const { loading, pathname } = this.state

    if (loading) {
      return <div>Authenticating...</div>
    } else {
      return <Redirect to={pathname} />
    }
  }
}
