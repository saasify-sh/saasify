import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'
import { Avatar, Table } from 'antd'
import { observer, inject } from 'mobx-react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

import styles from './styles.module.css'

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
    dataIndex: 'subscription'
  },
  {
    title: 'Subscribed',
    dataIndex: 'subscribed',
    render: (date) => (
      date ? format(new Date(date), 'MM/DD/YYYY') : ''
    )
  }
]

@inject('auth')
@observer
export class DashboardSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const {
      auth,
      ...rest
    } = this.props

    const dataSource = [
      {
        id: auth.user.id,
        username: auth.user.username,
        email: auth.user.email,
        image: auth.user.image,
        joined: auth.user.createdAt,
        subscription: auth.consumer && auth.consumer.enabled ? 'Unlimited' : 'Free',
        subscribed: auth.consumer && auth.consumer.createdAt
      }
    ]

    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Dashboard'
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
}
