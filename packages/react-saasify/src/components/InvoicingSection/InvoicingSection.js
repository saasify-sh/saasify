import React, { Component } from 'react'
import PropTypes from 'prop-types'
import titleize from 'titleize'

import { format } from 'date-fns'
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Table, Tag } from 'lib/antd'

import { Section } from '../Section'

import API from 'lib/api'
import theme from 'lib/theme'

import styles from './styles.module.css'

const statusColors = {
  draft: 'geekblue',
  open: 'red',
  paid: 'green',
  uncollectable: 'volcano',
  void: 'purple'
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'number'
  },
  {
    title: 'Date',
    dataIndex: 'created',
    render: (timestamp) => format(new Date(timestamp * 1000), 'MM/dd/yyyy')
  },
  {
    title: 'Amount',
    dataIndex: 'amount_due',
    render: (amount) => `$${(amount / 100).toFixed(2)}`
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => {
      const color = statusColors[status]

      return <Tag color={color}>{titleize(status)}</Tag>
    }
  },
  {
    title: 'PDF',
    dataIndex: 'invoice_pdf',
    render: (link) => (
      <a
        href={link}
        title='Invoice PDF'
        target='_blank'
        rel='noopener noreferrer'
      >
        Download
      </a>
    )
  }
]

@inject('auth')
@observer
export class InvoicingSection extends Component {
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
      <Section id='invoicing' title='Invoicing' {...rest}>
        <div className={theme(styles, 'body')}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
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

      API.listBillingInvoicesForConsumer(auth.consumer, opts).then(
        (invoices) => {
          const pagination = { ...this.state.pagination }

          if (!invoices.length) {
            pagination.total = data.length
          } else {
            data = data.concat(invoices)
            pagination.total = data.length
          }

          this.setState({
            loading: false,
            data,
            pagination
          })
        }
      )
    }
  }
}
