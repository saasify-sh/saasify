import React, { Component } from 'react'
import theme from 'lib/theme'
import { observer, inject } from 'mobx-react'

import styles from './styles.module.css'

@inject('config')
@observer
export class Logo extends Component {
  render() {
    const { className, style = {}, light, config, ...rest } = this.props

    return config.logo ? (
      <img
        className={theme(styles, 'logo', className)}
        src={(light && config.deployment?.saas?.logoLight) || config.logo}
        alt={`${config.name} Logo`}
        style={style}
        {...rest}
      />
    ) : (
      <div className={theme(styles, 'logo', className)} style={style} {...rest}>
        {config.name}
      </div>
    )
  }
}
