import React, { Component } from 'react'

import { Section } from '../Section'

export class BlankSection extends Component {
  render() {
    const {
      style,
      ...rest
    } = this.props

    return (
      <Section
        id='blank'
        style={{
          height: '8em',
          ...style
        }}
        {...rest}
      />
    )
  }
}
