import React, { Component } from 'react'
import theme from 'lib/theme'
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
        className={theme(styles, 'cta-button', className, styles[type], inline && theme(styles, 'inline'))}
        {...rest}
      >
        {children}
      </Button>
    )
  }
}
