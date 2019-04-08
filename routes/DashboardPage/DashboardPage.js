import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'antd'

import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export class DashboardPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <p>Dashboard Page</p>

        <Button
          onClick={this._onClickLogout}
        >
          Logout
        </Button>
      </div>
    )
  }

  _onClickLogout = (e) => {
    this.props.auth.signout()
  }
}
