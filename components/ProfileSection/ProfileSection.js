import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Avatar, Button, Divider, Popconfirm, Table, Tooltip, notification } from 'antd'
import { observer, inject } from 'mobx-react'

import { Section } from '../Section'

import API from 'lib/api'

import styles from './styles.module.css'

@inject('auth')
@observer
export class ProfileSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    copiedTextToClipboard: false,
    isLoadingUnsubscribe: false,
    isLoadingRefreshAuthToken: false
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
      copiedTextToClipboard,
      isLoadingUnsubscribe,
      isLoadingRefreshAuthToken
    } = this.state

    const hasSubscription = auth.consumer && auth.consumer.enabled

    const columns = [
      {
        title: 'Avatar',
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
      /*
      hasSubscription && {
        title: 'Subscribed',
        dataIndex: 'subscribed',
        render: (date) => (
          date ? format(new Date(date), 'MM/DD/YYYY') : ''
        )
      },
      */
      hasSubscription && {
        title: 'Auth Token',
        dataIndex: 'token',
        render: (token) => (
          <Tooltip
            placement='top'
            title={copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'}
          >
            <Button
              type='primary'
              ghost
              onClick={this._onClickCopyToken}
            >
              {`${auth.consumer.token.substr(0, 8)} ...`}
            </Button>
          </Tooltip>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (token) => (
          hasSubscription ? (
            <>
              <Button
                type='ghost'
                icon='reload'
                loading={isLoadingRefreshAuthToken}
                onClick={this._onClickRefreshAuthToken}
              >
                Refresh Token
              </Button>

              <Divider type='vertical' />

              <Popconfirm
                placement='top'
                title='Are you sure you want to cancel your subscription?'
                okText='Yes'
                cancelText='No'
                onConfirm={this._onConfirmUnsubscribe}
              >
                <Button
                  type='default'
                  loading={isLoadingUnsubscribe}
                >
                  Unsubscribe
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Button
              type='primary'
              href='/checkout?plan=unlimited'
            >
              Subscribe
            </Button>
          )
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

  _onConfirmUnsubscribe = () => {
    this.setState({ isLoadingUnsubscribe: true })

    API.removeConsumer(this.props.auth.consumer)
      .then(() => {
        this.props.auth.consumer = null

        notification.success({
          message: 'Subscription canceled',
          description: `Your subscription has been canceled. Any outstanding charges will be charged at the end of the current billing cycle.`
        })

        this.setState({ isLoadingUnsubscribe: false })
      }, (err) => {
        console.warn(err)

        notification.error({
          message: 'Error canceling subscription',
          description: err.error && err.error.message,
          duration: 0
        })

        this.setState({ isLoadingUnsubscribe: false })
      })
  }

  _onClickRefreshAuthToken = () => {
    this.setState({ isLoadingRefreshAuthToken: true })

    API.updateConsumer(this.props.auth.consumer)
      .then((consumer) => {
        this.props.auth.consumer = consumer

        notification.success({
          message: 'Auth token refreshed',
          description: `Your auth token has been refreshed. Your old token is now invalid.`
        })

        this.setState({ isLoadingRefreshAuthToken: false })
      }, (err) => {
        console.warn(err)

        notification.error({
          message: 'Error refreshing auth token',
          description: err.error && err.error.message,
          duration: 0
        })

        this.setState({ isLoadingRefreshAuthToken: false })
      })
  }
}
