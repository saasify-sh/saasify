import React, { useCallback } from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { AutoComplete } from 'lib/antd'

export const ServiceInputSelect = ({
  default: defaultValue,
  onChange,
  enum: items,
  ...props
}) => {
  const onChangeMem = useCallback(
    (value) => onChange({ target: { value, name: props.propKey } }),
    []
  )

  return (
    <ServiceInputWrapperWithLabel {...props}>
      <AutoComplete
        dataSource={items}
        defaultValue={defaultValue}
        style={{ width: '100%' }}
        onSelect={onChangeMem}
        filterOption
        placeholder='Select'
      />
    </ServiceInputWrapperWithLabel>
  )
}
