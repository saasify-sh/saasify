import React from 'react'

// props is the "properties" object, where the values are React components
export const ServiceEntry = ({ propKey, _type, onChange, ...props }) => (
  <React.Fragment>{Object.values(props)}</React.Fragment>
)
