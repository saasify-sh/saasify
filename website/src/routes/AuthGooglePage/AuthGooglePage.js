import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { observer, inject } from 'mobx-react'
import { Redirect, withRouter } from 'react-router-dom'
import { debug, notification } from 'react-saasify'
import { withTracker } from 'lib/with-tracker'

import deployment from 'lib/deployment'

@withTracker
@withRouter
@inject('auth')
@observer
export class AuthGooglePage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    loading: true,
    pathname: '/'
  }

  componentDidMount() {
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    })

    if (!query.code || !query.route) {
      notification.error({
        message: 'Error authenticating with Google'
      })
      this.setState({ loading: false })
      return
    }

    this.setState({
      pathname: query.route
    })

    this.props.auth
      .authWithGoogle(
        {
          code: query.code
        },
        {
          deployment: deployment.id
        }
      )
      .then(
        () => {
          this.setState({ loading: false })
        },
        (err) => {
          this.setState({ loading: false })

          debug(err)
          notification.error({
            message: 'Error authenticating with Google',
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
