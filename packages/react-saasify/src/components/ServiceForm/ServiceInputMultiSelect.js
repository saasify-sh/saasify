import React, { Component } from 'react'
import { ServiceInputJSON } from './ServiceInputJSON'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { Select } from 'lib/antd'

const style = { width: '100%' }

export class ServiceInputMultiSelect extends Component {
  _values = this.props.default

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
          onSelect={this._onSelect}
          onDeselect={this._onDeselect}
          mode='multiple'
          placeholder='Select'
        >
          {children}
        </Select>
      </ServiceInputWrapperWithLabel>
    )
  }

  _onSelect = (value) => {
    this._values.push(value)
    console.log('select', { value, values: this._values })
    this.props.onChange({
      target: { value: this._values, name: this.props.propKey }
    })
  }

  _onDeselect = (value) => {
    this._values = this._values.filter((v) => v !== value)
    console.log('deselect', { value, values: this._values })
    this.props.onChange({
      target: { value: this._values, name: this.props.propKey }
    })
  }
}
