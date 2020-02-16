import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { Blob } from '../../Blob/Blob'

import styles from './styles.module.css'

export class BenefitsBlob extends Component {
  _blobRef = React.createRef()

  render() {
    const { className, title, footer, arrow, fill, items, ...rest } = this.props

    return (
      <div
        className={theme(styles, 'container', className)}
        onClick={this.reset}
        {...rest}
      >
        <div className={theme(styles, 'body')}>
          <Blob
            className={theme(styles, 'blob')}
            fill={fill}
            ref={this._blobRef}
          />

          <div className={theme(styles, 'body-content')}>
            <h3 className={theme(styles, 'benefits-title')}>{title}</h3>
            <div className={theme(styles, 'items')}>
              {items.map((item) => (
                <div className={theme(styles, 'item')} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={theme(styles, 'footer')}>
          <img src={arrow} alt='Arrow' />

          {footer}
        </div>
      </div>
    )
  }

  reset = () => {
    this._blobRef.current.reset()
  }
}
