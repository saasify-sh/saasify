import React from 'react'
import { ServiceInputWrapper } from './ServiceInputWrapper'
import { Checkbox } from 'lib/antd'

export const ServiceInputCheckbox = ({
  default: defaultValue,
  type,
  propKey,
  onChange,
  name
}) => (
  <ServiceInputWrapper>
    <Checkbox
      type={type}
      checked={defaultValue}
      onChange={onChange}
      name={name}
    >
      {propKey}
    </Checkbox>
  </ServiceInputWrapper>
)
