import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Table } from 'lib/antd'

import { Section } from '../Section'

import API from 'lib/api'
import theme from 'lib/theme'

import styles from './styles.module.css'

// TODO: also show total $ spent

const columns = [
  {
    title: 'Start',
    dataIndex: 'request.period.start',
    render: (timestamp) =>
      timestamp ? format(new Date(timestamp * 1000), 'MM/dd/yyyy') : ''
  },
  {
    title: 'End',
    dataIndex: 'request.period.end',
    render: (timestamp) =>
      timestamp ? format(new Date(timestamp * 1000), 'MM/dd/yyyy') : 'Current'
  },
  {
    title: 'Number of Requests',
    dataIndex: 'request.total_usage',
    render: (amount) => amount
  }
  /*
  {
    title: 'Compute Time (ms)',
    dataIndex: 'compute.total_usage',
    render: (amount) => amount
  },
  {
    title: 'Bandwidth (GBs)',
    dataIndex: 'bandwidth.total_usage',
    render: (amount) => (amount === undefined ? 0 : amount)
  }
  */
]

@inject('auth')
@observer
export class BillingUsageSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    data: [],
    pagination: {
      pageSize: 10
    },
    loading: false
  }

  componentDidMount() {
    this._fetch()
  }

  componentWillUnmount() {
    this._disposer()
  }

  _disposer = reaction(
    () => this.props.auth.consumer,
    () => this._fetch({ reset: true })
  )

  render() {
    const { auth, ...rest } = this.props

    const { data, pagination, loading } = this.state

    return (
      <Section id='billing-usage' title='Usage' {...rest}>
        <div className={theme(styles, 'body')}>
          <Table
            columns={columns}
            rowKey={(record) => record.request.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this._handleTableChange}
          />
        </div>
      </Section>
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
    const { auth } = this.props

    if (!auth.consumer) {
      return
    }

    let { data, pagination } = this.state

    if (params.reset) {
      data = []
      params.page = 0
    }

    if (!params.page || params.page * pagination.pageSize >= data.length) {
      this.setState({ loading: true })

      const opts = { limit: 10 }

      if (data.length) {
        opts.ending_before = data[data.length - 1].id
      }

      API.listBillingUsageForConsumer(auth.consumer, opts).then((items) => {
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
