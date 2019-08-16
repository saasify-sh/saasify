import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Avatar, Button, Table, Tooltip } from 'antd'
import { observer, inject } from 'mobx-react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

import styles from './styles.module.css'

@inject('auth')
@observer
export class ProfileSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    copiedTextToClipboard: false
  }

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const {
      auth,
      ...rest
    } = this.props

    const {
      copiedTextToClipboard
    } = this.state

    const hasSubscription = auth.consumer && auth.consumer.enabled

    const columns = [
      {
        title: 'Picture',
        dataIndex: 'image',
        render: (image) => (
          image ? (
            <Avatar
              src={image}
              className={styles.avatar}
            />
          ) : (
            <Avatar
              icon='user'
              className={styles.avatar}
            />
          )
        )
      },
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email',
        dataIndex: 'email'
      },
      {
        title: 'Joined',
        dataIndex: 'joined',
        render: (date) => (
          format(new Date(date), 'MM/DD/YYYY')
        )
      },
      {
        title: 'Subscription',
        dataIndex: 'subscription',
        render: (subscription) => (
          <Link to='/pricing'>{subscription}</Link>
        )
      },
      hasSubscription && {
        title: 'Subscribed',
        dataIndex: 'subscribed',
        render: (date) => (
          date ? format(new Date(date), 'MM/DD/YYYY') : ''
        )
      },
      hasSubscription && {
        title: 'Auth Token',
        dataIndex: 'token',
        render: (token) => (
          <Tooltip
            placement='top'
            title={copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'}
          >
            <Button
              onClick={this._onClickCopyToken}
            >
              {`${auth.consumer.token.substr(0, 8)} ...`}
            </Button>
          </Tooltip>
        )
      }
    ].filter(Boolean)

    const dataSource = [
      {
        id: auth.user.id,
        username: auth.user.username,
        email: auth.user.email,
        image: auth.user.image,
        joined: auth.user.createdAt,
        subscription: hasSubscription ? 'Unlimited' : 'Free',
        subscribed: auth.consumer && auth.consumer.createdAt
      }
    ]

    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Profile'
            {...rest}
          >
            <div className={styles.body}>
              <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={dataSource}
                pagination={false}
              />
            </div>
          </Section>
        )}
      </FinContext.Consumer>
    )
  }

  _onClickCopyToken = () => {
    const { token } = this.props.auth.consumer
    copyTextToClipboard(token)

    this.setState({ copiedTextToClipboard: true })
    this._clearCopyTimeout()
    this._copyTimeout = setTimeout(this._onCopyTimeout, 3000)
  }

  _onCopyTimeout = () => {
    this._clearCopyTimeout()
    this.setState({ copiedTextToClipboard: false })
  }

  _clearCopyTimeout = () => {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }
}
