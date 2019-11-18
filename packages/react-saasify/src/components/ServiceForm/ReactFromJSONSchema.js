import React, { useCallback } from 'react'

import ReactFromJSON from 'react-from-json'

const mapProp = (prop, onChange) => {
  if (prop && prop !== onChange && prop.type) {
    const { type, ...props } = prop

    return {
      type: props.enum ? 'enum' : type,
      props: {
        ...props,
        onChange,
        name: props.propKey
      }
    }
  }

  return prop
}

export const ReactFromJSONSchema = ({ definition, mapping, onChange }) => {
  const memMapProp = useCallback((prop) => mapProp(prop, onChange), [])

  return (
    <ReactFromJSON
      entry={{ ...definition.params.schema.properties, type: 'entry' }}
      mapping={mapping}
      mapProp={memMapProp}
    />
  )
}
