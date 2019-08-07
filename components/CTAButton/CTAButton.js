import React, { Component } from 'react'
import cs from 'classnames'
import { Button } from 'antd'

import styles from './styles.module.css'

export class CTAButton extends Component {
  render() {
    const {
      className,
      children,
      type,
      inline,
      ...rest
    } = this.props

    return (
      <Button
        type='primary'
        className={cs(styles.button, this.props.className, styles[type], inline && styles.inline)}
        {...rest}
      >
        {children}
      </Button>
    )
  }
}
