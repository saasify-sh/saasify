import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import styles from './styles.module.css'

export class UndrawSVG extends React.Component {
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
        className={cs(styles.undrawSVG, className)}
        src={uri}
        {...rest}
      />
    )
  }
}
