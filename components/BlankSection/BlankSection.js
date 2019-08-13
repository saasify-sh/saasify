import React, { Component } from 'react'

export class BlankSection extends Component {
  render() {
    const {
      inverted = false,
      style,
      ...rest
    } = this.props

    return (
      <section
        style={{
          background: inverted ? '#1e3a54' : '#23303a',
          height: '8em',
          ...style
        }}
        {...rest}
      >
      </section>
    )
  }
}
