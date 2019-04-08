import React, { Component } from 'react'
import PropTypes from 'prop-types'

import raf from 'raf'

import styles from './styles.module.css'

const isServer = (typeof window === 'undefined')

export class NavHeader extends Component {
  static propTypes = {
    fixed: PropTypes.bool
  }

  static defaultProps = {
    fixed: false
  }

  state = {
    attached: (isServer || window.scrollY > 0)
  }

  componentDidMount() {
    if (!isServer) {
      window.addEventListener('scroll', this._onScroll)
      this._onScrollAF()
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      window.removeEventListener('scroll', this._onScroll)
    }

    if (this._scrollRaf) {
      raf.cancel(this._scrollRaf)
      this._scrollRaf = null
    }
  }

  render() {
    const { fixed } = this.props
    const { attached } = this.state

    return (
      <header className={styles.container + ' ' + (attached || fixed ? styles.attached : '')} />
    )
  }

  _onScroll = () => {
    if (!this._scrollRaf) {
      this._scrollRaf = raf(this._onScrollAF)
    }
  }

  _onScrollAF = () => {
    this._scrollRaf = null

    this.setState({
      attached: (isServer || window.scrollY > 0)
    })
  }
}
