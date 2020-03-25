import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Loading } from '../Loading'

import styles from './styles.module.css'

@inject('auth')
@inject('config')
@observer
export class ConsumerFrameEmbed extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  _frameRef = React.createRef()

  componentDidMount() {
    window.addEventListener('message', this._onMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this._onMessage)
  }

  render() {
    const { src, auth, config, className, ...rest } = this.props

    if (auth.isBootstrapping) {
      return <Loading />
    }

    if (!auth.isAuthenticated) {
      return null
    }

    return (
      <iframe
        src={src}
        className={theme(styles, 'consumer-frame-embed', className)}
        seamless
        {...rest}
        ref={this._frameRef}
      />
    )
  }

  _onMessage = (event) => {
    const { auth, config } = this.props
    const { deployment } = config
    const { project } = deployment
    let message

    try {
      message = JSON.parse(event.data)
      console.log('iframe message', message)

      if (message.type !== 'saasify-sdk:init') {
        return
      }
    } catch (err) {
      // ignore other types of messages
      return
    }

    try {
      const { projectId } = message.data
      if (projectId !== project.id) {
        throw new Error(
          `Saasify SDK project mismatch error: expected "${project.id}" received "${projectId}"`
        )
      }

      const iframe = this._frameRef.current
      const res = JSON.stringify({
        type: 'saasify-sdk:init',
        data: {
          project,
          deployment,
          consumer: toJS(auth.consumer)
        }
      })

      iframe.contentWindow.postMessage(res, '*')
    } catch (err) {
      console.warn('iframe message error', err)
    }
  }
}
