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
    const {
      className,
      name,
      color,
      ...rest
    } = this.props

    const uri = name.indexOf('/') >= 0 || name.indexOf('.') >= 0
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
