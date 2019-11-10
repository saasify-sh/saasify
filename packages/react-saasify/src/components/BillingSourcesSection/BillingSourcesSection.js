import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Button, Divider, Icon, Modal, Table, notification } from 'lib/antd'
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

import { Section } from '../Section'
import { CheckoutForm } from '../CheckoutForm'

import API from 'lib/api'
import theme from 'lib/theme'

import styles from './styles.module.css'

// TODO: fix minor css jank with fixed header when opening modal

@inject('auth')
@observer
export class BillingSourcesSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    data: [],
    hasMoreData: true,
    isLoading: false,
    isVisibleAddNewSourceModal: false,
    isVisibleRemoveSourceModal: false,
    isVisibleSetDefaultSourceModal: false,
    isLoadingAddNewSourceModal: false,
    isLoadingRemoveSourceModal: false,
    isLoadingSetDefaultSourceModal: false,
    selectedSource: null
  }

  _columns = [
    {
      title: 'Brand',
      dataIndex: 'brand'
    },
    {
      title: 'Number',
      dataIndex: 'last4',
      render: (last4) => `XXXX - ${last4}`
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Expiration',
      key: 'expiration',
      render: (card) => `${card.exp_month} / ${card.exp_year}`
    },
    {
      title: 'Zipcode',
      dataIndex: 'address_zip'
    },
    {
      title: 'Default',
      dataIndex: 'default',
      render: (isDefault) =>
        isDefault ? (
          <Icon
            type='check-circle'
            theme='twoTone'
            twoToneColor='#52c41a'
            style={{ fontSize: '1.8em' }}
          />
        ) : (
          ''
        )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (card) => (
        <Fragment>
          <Button
            type='link'
            disabled={card.default}
            onClick={() => this._onClickRemoveSourceButton(card)}
          >
            Remove
          </Button>

          <Divider type='vertical' />

          <Button
            type='link'
            disabled={card.default}
            onClick={() => this._onClickSetDefaultSourceButton(card)}
          >
            Set Default
          </Button>
        </Fragment>
      )
    }
  ]

  componentDidMount() {
    this._fetch()
  }

  componentWillUnmount() {
    this._disposer()
  }

  _disposer = reaction(
    () => this.props.auth.user,
    () => this._fetch()
  )

  render() {
    const { auth, ...rest } = this.props

    const {
      data,
      isLoading,
      isVisibleAddNewSourceModal,
      isVisibleRemoveSourceModal,
      isVisibleSetDefaultSourceModal,
      isLoadingAddNewSourceModal,
      isLoadingRemoveSourceModal,
      isLoadingSetDefaultSourceModal,
      selectedSource
    } = this.state

    return (
      <Section id='billing-sources' title='Payment Methods' {...rest}>
        <div className={theme(styles, 'body')}>
          <Table
            columns={this._columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={false}
            loading={isLoading}
            onChange={this._handleTableChange}
          />

          <Button
            type='primary'
            className={theme(styles, 'addSourceButton')}
            onClick={this._onClickAddNewSourceButton}
          >
            Add New Payment Method
          </Button>
        </div>

        <Modal
          title='Add New Payment Method'
          visible={isVisibleAddNewSourceModal}
          okButtonProps={{ disabled: true }}
          confirmLoading={isLoadingAddNewSourceModal}
          onCancel={this._onCancelNewSourceModal}
        >
          {isVisibleAddNewSourceModal && (
            <CheckoutForm
              action='Add Card'
              loading={isLoadingAddNewSourceModal}
              onSubmit={this._onConfirmNewSourceModal}
            />
          )}
        </Modal>

        <Modal
          title='Remove Payment Method'
          visible={isVisibleRemoveSourceModal}
          onOk={this._onConfirmRemoveSourceModal}
          confirmLoading={isLoadingRemoveSourceModal}
          onCancel={this._onCancelRemoveSourceModal}
        >
          {selectedSource && (
            <div>
              Are you sure you want to remove the {selectedSource.brand} card
              ending in <b>{selectedSource.last4}</b> from your payment methods?
            </div>
          )}
        </Modal>

        <Modal
          title='Set Default Payment Method'
          visible={isVisibleSetDefaultSourceModal}
          onOk={this._onConfirmSetDefaultSourceModal}
          confirmLoading={isLoadingSetDefaultSourceModal}
          onCancel={this._onCancelSetDefaultSourceModal}
        >
          {selectedSource && (
            <div>
              Are you sure you want to set the {selectedSource.brand} card
              ending in <b>{selectedSource.last4}</b> as your default payment
              method?
            </div>
          )}
        </Modal>
      </Section>
    )
  }

  _handleTableChange = (pagination, filters, sorter) => {
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

    if (!auth.user) {
      return
    }

    let { data, hasMoreData } = this.state

    if (!data.length && hasMoreData) {
      this.setState({ isLoading: true })

      API.listBillingSources().then(
        (sources) => {
          if (!sources.length) {
            hasMoreData = false
          } else {
            sources.sort((a, b) => a.id.localeCompare(b.id))
            data = data.concat(sources)
          }

          this.setState({
            isLoading: false,
            data,
            hasMoreData
          })
        },
        (err) => {
          console.warn(err)

          this.setState({
            isLoading: false
          })
        }
      )
    }
  }

  _onClickAddNewSourceButton = () => {
    this.setState({ isVisibleAddNewSourceModal: true })
  }

  _onConfirmNewSourceModal = async ({ name, stripe }) => {
    this.setState({ isLoadingAddNewSourceModal: true })

    try {
      const { token, error } = await stripe.createToken({ name })
      console.log({ token, error })

      if (error) {
        notification.error({
          message: 'Error processing payment method',
          description: error.message,
          duration: 0
        })
        this.setState({ isLoadingAddNewSourceModal: false })
        return
      }

      const source = await API.addBillingSource({ source: token.id })
      console.log('checkout source', { source })

      this.setState(
        {
          data: [],
          hasMoreData: true,
          isLoadingAddNewSourceModal: false,
          isVisibleAddNewSourceModal: false
        },
        () => {
          notification.success({
            message: 'Payment Method Added',
            description: `Your ${source.brand} card ending in ${source.last4} was added successfully.`
          })

          this._fetch()
        }
      )
    } catch (err) {
      notification.error({
        message: 'Error adding payment source',
        description: err.error && err.error.message,
        duration: 0
      })

      this.setState({ isLoadingAddNewSourceModal: false })
    }
  }

  _onCancelNewSourceModal = () => {
    this.setState({ isVisibleAddNewSourceModal: false })
  }

  _onClickRemoveSourceButton = (selectedSource) => {
    this.setState({ isVisibleRemoveSourceModal: true, selectedSource })
  }

  _onConfirmRemoveSourceModal = () => {
    const { selectedSource } = this.state
    this.setState({ isLoadingRemoveSourceModal: true })

    API.removeBillingSource(selectedSource.id).then(
      () => {
        this.setState(
          {
            data: [],
            hasMoreData: true,
            isLoadingRemoveSourceModal: false,
            isVisibleRemoveSourceModal: false,
            selectedSource: null
          },
          () => {
            notification.success({
              message: 'Card Removed',
              description: `Your ${selectedSource.brand} card ending in ${selectedSource.last4} has been removed.`
            })

            this._fetch()
          }
        )
      },
      (err) => {
        console.warn(err)

        this.setState({ isLoadingRemoveSourceModal: false })

        notification.error({
          message: 'Error',
          description: `There was an error trying to remove your ${selectedSource.brand} card ending in ${selectedSource.last4}.`,
          duration: 10
        })
      }
    )
  }

  _onCancelRemoveSourceModal = () => {
    this.setState({ isVisibleRemoveSourceModal: false, selectedSource: null })
  }

  _onClickSetDefaultSourceButton = (selectedSource) => {
    this.setState({ isVisibleSetDefaultSourceModal: true, selectedSource })
  }

  _onConfirmSetDefaultSourceModal = () => {
    const { selectedSource } = this.state
    this.setState({ isLoadingSetDefaultSourceModal: true })

    API.setDefaultBillingSource(selectedSource.id).then(
      () => {
        this.setState(
          {
            data: [],
            hasMoreData: true,
            isLoadingSetDefaultSourceModal: false,
            isVisibleSetDefaultSourceModal: false,
            selectedSource: null
          },
          () => {
            notification.success({
              message: 'Card Set as Default',
              description: `Your ${selectedSource.brand} card ending in ${selectedSource.last4} has been set as your default payment method.`
            })

            this._fetch()
          }
        )
      },
      (err) => {
        console.warn(err)

        this.setState({ isLoadingRemoveSourceModal: false })

        notification.error({
          message: 'Error',
          description: `There was an error trying to set the ${selectedSource.brand} card ending in ${selectedSource.last4} as your default payment method.`,
          duration: 10
        })
      }
    )
  }

  _onCancelSetDefaultSourceModal = () => {
    this.setState({
      isVisibleSetDefaultSourceModal: false,
      selectedSource: null
    })
  }
}
