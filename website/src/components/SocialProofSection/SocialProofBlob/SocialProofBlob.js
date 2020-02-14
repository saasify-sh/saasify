import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { Blob } from '../../Blob/Blob'

import styles from './styles.module.css'

export class SocialProofBlob extends Component {
  _blobRef = React.createRef()

  render() {
    const {
      className,
      quote,
      photo,
      name,
      title,
      longestQuote,
      ...rest
    } = this.props

    return (
      <div
        className={theme(styles, 'body', className)}
        onClick={this.reset}
        {...rest}
      >
        <Blob
          className={theme(styles, 'blob')}
          fill='url(#g1)'
          ref={this._blobRef}
        />

        <div className={theme(styles, 'body-content')}>
          <div className={theme(styles, 'body-quote')}>
            <div className={theme(styles, 'layout')}>“{longestQuote}”</div>
            <div className={theme(styles, 'real')}>“{quote}”</div>
          </div>

          <div className={theme(styles, 'body-footer')}>
            <img src={photo} alt={name} />

            <div className={theme(styles, 'body-footer-caption')}>
              <div className={theme(styles, 'body-footer-caption-name')}>
                {name}
              </div>

              <div className={theme(styles, 'body-footer-caption-title')}>
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  reset = () => {
    this._blobRef.current.reset()
  }
}
