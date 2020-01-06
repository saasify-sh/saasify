import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

export class UndrawSVG extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    className: PropTypes.string
  }

  render() {
    const { className, name, color, ...rest } = this.props

    const uri =
      name.includes('/') || name.includes('.')
        ? name
        : `/assets/undraw/${name}.svg`

    return (
      <img
        src={uri}
        alt={name}
        className={theme(null, 'undrawSVG', className)}
        {...rest}
      />
    )
  }
}
