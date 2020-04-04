import React from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { InputNumber } from 'lib/antd'

export class ServiceInputNumber extends React.Component {
  render() {
    const { default: defaultValue, onChange, name, ...props } = this.props
    return (
      <ServiceInputWrapperWithLabel {...props}>
        <InputNumber
          value={defaultValue}
          onChange={this._onChange}
          name={name}
        />
      </ServiceInputWrapperWithLabel>
    )
  }

  _onChange = (value) => {
    this.props.onChange({
      target: {
        name: this.props.name || this.props.propKey,
        value
      }
    })
  }
}
