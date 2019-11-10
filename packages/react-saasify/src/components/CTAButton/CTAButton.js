import React, { Component } from 'react'
import theme from 'lib/theme'
import { Button } from 'lib/antd'
import { observer } from 'mobx-react'
import Hoverable from 'react-event-as-prop/lib/Hoverable'

import styles from './styles.module.css'

@Hoverable
@observer
export class CTAButton extends Component {
  render() {
    const {
      hovered,
      type = 'primary',
      inline,
      className,
      children,
      style = {},
      ...rest
    } = this.props

    const primaryColor = theme['@primary-color']
    const borderColor =
      type === 'secondary' || !hovered ? primaryColor : 'transparent'

    const ownStyle = {
      border: `2px solid ${borderColor}`
    }

    if (type === 'secondary') {
      ownStyle.background = hovered ? primaryColor : 'transparent'
    }

    return (
      <Button
        type={type}
        className={theme(
          styles,
          'cta-button',
          className,
          type,
          styles[type],
          inline && theme(styles, 'inline')
        )}
        style={{
          ...ownStyle,
          ...style
        }}
        {...rest}
      >
        {children}
      </Button>
    )
  }
}
