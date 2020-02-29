/**
 * @class LayoutCentered
 *
 * Component for centering a child element horizontally and vertically.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export class LayoutCentered extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.any
  }

  render() {
    const { children, className, style } = this.props

    return (
      <div
        className={`${styles.layoutCentered} ${className || ''}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}
