import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { format } from 'date-fns'
import { API, Avatar, Table, theme } from 'react-saasify'

import { TabPane } from '../TabPane'

import styles from './styles.module.css'

const columns = [
  {
    title: '',
    dataIndex: 'image',
    render: (image) =>
      image ? (
        <Avatar src={image} className={theme(styles, 'avatar')} />
      ) : (
        <Avatar icon='user' className={theme(styles, 'avatar')} />
      )
  },
  {
    title: 'Username',
    dataIndex: 'user.username'
  },
  {
    title: 'Email',
    dataIndex: 'user.email'
  },
  {
    title: 'Plan',
    dataIndex: 'plan'
  },
  {
    title: 'Date Subscribed',
    dataIndex: 'createdAt',
    render: (date) => format(new Date(date), 'MM/dd/yyyy')
  }
]

@observer
export class CustomersTabPane extends Component {
  state = {
    data: [],
    pagination: {
      pageSize: 25
    },
    loading: false
  }

  componentDidMount() {
    this._fetch()
  }

  render() {
    const { data, pagination, loading } = this.state

    return (
      <TabPane className={styles.body}>
        <Table
          columns={columns}
          rowKey={(model) => model.id}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this._handleTableChange}
        />
      </TabPane>
    )
  }

  _handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({ pagination: pager })

    this._fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  _fetch = (params = {}) => {
    const { project } = this.props

    let { data, pagination } = this.state

    if (params.reset) {
      data = []
      params.page = 0
    }

    if (!params.page || params.page * pagination.pageSize >= data.length) {
      this.setState({ loading: true })

      const opts = { limit: 10 }

      if (data.length) {
        opts.offset = data.length
      }

      API.listConsumers({
        sort: '-createdAt',
        ...opts,
        where: {
          project: project.id
        },
        populate: 'user'
      }).then((items) => {
        const pagination = { ...this.state.pagination }

        if (!items.length) {
          pagination.total = data.length
        } else {
          data = data.concat(items)
          pagination.total = data.length
        }

        this.setState({
          loading: false,
          data,
          pagination
        })
      })
    }
  }
}
