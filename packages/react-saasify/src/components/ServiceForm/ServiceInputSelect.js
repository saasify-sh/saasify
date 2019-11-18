import React, { Component } from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { AutoComplete } from 'lib/antd'
import Fuse from 'fuse.js'

const style = { width: '100%' }

export class ServiceInputSelect extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    const { props } = this
    const docs = props.enum.map((item) => ({ n: item }))
    this._fuse = new Fuse(docs, {
      keys: ['n'],
      location: 7,
      threshold: 0.2,
      shouldSort: true
    })
  }

  render() {
    const {
      default: defaultValue,
      onChange,
      enum: enums,
      ...props
    } = this.props

    const { items } = this.state
    const children = items.map((item) => (
      <AutoComplete.Option key={item.n}>{item.n}</AutoComplete.Option>
    ))

    return (
      <ServiceInputWrapperWithLabel {...props}>
        <AutoComplete
          defaultValue={defaultValue}
          style={style}
          onSelect={this._onChange}
          onSearch={this._onSearch}
          placeholder='Select'
        >
          {children}
        </AutoComplete>
      </ServiceInputWrapperWithLabel>
    )
  }

  _onChange = (value) => {
    this.props.onChange({ target: { value, name: this.props.propKey } })
  }

  _onSearch = (value) => {
    const results = this._fuse.search(value).slice(0, 32)
    this.setState({ items: results })
  }
}
