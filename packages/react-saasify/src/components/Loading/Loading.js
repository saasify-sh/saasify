import React, { Component } from 'react'
import theme from 'lib/theme'

import { Icon } from 'lib/antd'

import styles from './styles.module.css'

export class Loading extends Component {
  render() {
    const { className, title, ...rest } = this.props

    return (
      <div className={theme(styles, 'loading', className)} {...rest}>
        {title && (
          <h3 className={theme(styles, 'title', className)}>{title}</h3>
        )}

        <Icon
          className={theme(styles, 'loading-icon', className)}
          type='loading'
        />
      </div>
    )
  }
}
