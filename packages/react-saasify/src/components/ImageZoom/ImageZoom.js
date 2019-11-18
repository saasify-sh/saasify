import React, { Component } from 'react'

/**
 * Wrapper around [medium-zoom](https://github.com/francoischalifour/medium-zoom).
 */
export class ImageZoom extends Component {
  _zoom = this.props.zoom.clone()

  render() {
    return (
      <img src={this.props.src} alt={this.props.alt} ref={this._attachZoom} />
    )
  }

  _attachZoom = (image) => {
    this._zoom.attach(image)
  }
}
