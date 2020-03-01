import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { observer, inject } from 'mobx-react'
import { Redirect, withRouter } from 'react-router-dom'
import { debug, message } from 'react-saasify'

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
    pathname: '/'
  }

  componentDidMount() {
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    })

    if (!query.code || !query.route) {
      message.error('Error authenticating with GitHub')
      this.setState({ loading: false })
      return
    }

    this.setState({
      pathname: query.route
    })

    this.props.auth
      .authWithGitHub({
        code: query.code,
        route: query.route
      })
      .then(
        () => {
          this.setState({ loading: false })
        },
        (err) => {
          this.setState({ loading: false })

          debug(err)
          message.error('Error authenticating with GitHub.')
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
