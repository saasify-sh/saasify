import React from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { InputNumber } from 'lib/antd'

export const ServiceInputNumber = ({
  default: defaultValue,
  onChange,
  name,
  ...props
}) => (
  <ServiceInputWrapperWithLabel {...props}>
    <InputNumber value={defaultValue} onChange={onChange} name={name} />
  </ServiceInputWrapperWithLabel>
)
