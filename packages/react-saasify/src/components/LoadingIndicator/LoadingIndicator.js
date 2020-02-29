/**
 * @class LoadingIndicator
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { LayoutCentered } from '../LayoutCentered'

// import { Spin } from 'lib/antd'
// import { LoadingOutlined } from '@ant-design/icons'

import styles from './styles.css'

const darkStyle = {
  background: 'rgba(0, 0, 0, 0.6)'
}

const lightStyle = {
  background: 'transparent'
}

export class LoadingIndicator extends PureComponent {
  static propTypes = {
    dark: PropTypes.bool
  }

  static defaultProps = {
    dark: true
  }

  render() {
    const { dark } = this.props

    return (
      <LayoutCentered
        className={styles.loadingIndicator}
        style={dark ? darkStyle : lightStyle}
      >
        Loading...
      </LayoutCentered>
    )
  }
}
