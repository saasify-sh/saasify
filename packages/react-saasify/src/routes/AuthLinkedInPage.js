import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { observer, inject } from 'mobx-react'
import { debug, notification } from '../lib'
import { handleAuth } from 'lib/checkout'
import { LocalStore } from '../store/LocalStore'

@inject('auth')
@observer
export class AuthLinkedInPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    loading: true,
    href: null
  }

  componentDidMount() {
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    })

    LocalStore.get('auth:location').then((href) => {
      this.setState({ href })

      this.props.auth.authWithLinkedIn(query).then(
        () => {
          this.setState({ loading: false })
        },
        (err) => {
          this.setState({ loading: false })

          debug(err)
          notification.error({
            message: 'Error authenticating with LinkedIn',
            description: err?.response?.data?.error || err.message
          })
        }
      )
    })
  }

  render() {
    const { loading, href } = this.state

    if (loading) {
      return <div>Authenticating...</div>
    } else {
      return handleAuth({ auth: this.props.auth, href })
    }
  }
}
