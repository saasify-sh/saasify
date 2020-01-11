import React, { Component } from 'react'
import { ServiceInputJSON } from './ServiceInputJSON'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { Select } from 'lib/antd'

const style = { width: '100%' }

export class ServiceInputMultiSelect extends Component {
  render() {
    const { default: defaultValue, onChange, ...props } = this.props

    const { items } = this.props
    const enums = items && items.props && items.props.enum

    if (!enums) {
      return <ServiceInputJSON {...this.props} />
    }

    const children = enums.map((item) => (
      <Select.Option key={item}>{item}</Select.Option>
    ))

    return (
      <ServiceInputWrapperWithLabel {...props}>
        <Select
          defaultValue={defaultValue}
          style={style}
          onSelect={this._onChange}
          mode='multiple'
          placeholder='Select'
        >
          {children}
        </Select>
      </ServiceInputWrapperWithLabel>
    )
  }

  _onChange = (value) => {
    this.props.onChange({ target: { value, name: this.props.propKey } })
  }
}
