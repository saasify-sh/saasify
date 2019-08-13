import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import styles from './styles.module.css'

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

    const uri = `/assets/undraw/${name}.svg`

    return (
      <img
        src={uri}
        alt={name}
        className={cs(styles.undrawSVG, className)}
        {...rest}
      />
    )
  }
}
