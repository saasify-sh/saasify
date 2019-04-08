import React, { Component } from 'react'
import PropTypes from 'prop-types'

import raf from 'raf'
import random from 'random'
import sizeMe from 'react-sizeme'

const isServer = typeof window === 'undefined'

const V = 0.025

class SectionDividerImpl extends Component {
  static propTypes = {
    foreground: PropTypes.string,
    background: PropTypes.string,
    inverted: PropTypes.bool,
    animated: PropTypes.bool,
    style: PropTypes.object,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }

  static defaultProps = {
    foreground: '#23303a',
    background: '#1e3a54',
    inverted: false,
    animated: false,
    style: { }
  }

  _state = {
    dx0: random.float(-V, V),
    dy0: random.float(-V, V),
    dx1: random.float(-V, V),
    dy1: random.float(-V, V),
    x0: random.float(0.0, 0.4),
    y0: random.float(0.2, 1.0),
    x1: random.float(0.4, 1.0),
    y1: random.float(0.5, 1.0)
  }

  componentDidMount() {
    if (!isServer) {
      window.addEventListener('resize', this._onResize)
      this._reset(this.props)
      this._tick()
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      window.removeEventListener('resize', this._onResize)
      if (this._tickRaf) {
        raf.cancel(this._tickRaf)
        this._tickRaf = null
      }
    }
  }

  render() {
    const {
      foreground,
      background,
      inverted,
      animated,
      style,
      ...rest
    } = this.props

    return (
      <div
        style={{
          width: '100%',
          height: 80,
          ...style
        }}
        {...rest}
        ref={this._containerRef}
      >
        <canvas
          ref={this._canvasRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    )
  }

  _containerRef = (ref) => {
    this._container = ref
  }

  _canvasRef = (ref) => {
    this._canvas = ref
  }

  _onResize = () => {
    this._canvas.width = this._container.clientWidth
    this._canvas.height = this._container.clientHeight
    this._draw()
  }

  _tick = () => {
    this._draw()

    if (this.props.animated) {
      this._update()
      this._tickRaf = raf(this._tick)
    }
  }

  _update() {
    let {
      dx0,
      dy0,
      dx1,
      dy1,
      x0,
      y0,
      x1,
      y1
    } = this._state

    dx0 = Math.max(-V, Math.min(V, dx0 + random.float(-V / 10, V / 10)))
    dy0 = Math.max(-V, Math.min(V, dy0 + random.float(-V / 10, V / 10)))
    dx1 = Math.max(-V, Math.min(V, dx1 + random.float(-V / 10, V / 10)))
    dy1 = Math.max(-V, Math.min(V, dy1 + random.float(-V / 10, V / 10)))

    x0 = Math.max(0.0, Math.min(0.4, x0 + dx0))
    y0 = Math.max(0.2, Math.min(1.0, y0 + dy0))
    x1 = Math.max(0.4, Math.min(1.0, x1 + dx1))
    y1 = Math.max(0.5, Math.min(1.0, y1 + dy1))

    this._state = {
      dx0,
      dy0,
      dx1,
      dy1,
      x0,
      y0,
      x1,
      y1
    }
  }

  _draw() {
    const {
      foreground,
      background,
      inverted
    } = this.props

    const {
      x0,
      y0,
      x1,
      y1
    } = this._state

    const ctx = this._canvas.getContext('2d')
    const w = this._canvas.width
    const h = this._canvas.height

    ctx.fillStyle = background
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = foreground
    ctx.beginPath()
    ctx.moveTo(0, inverted ? h : 0)
    const cx0 = w * x0
    const cy0 = h * y0
    const cx1 = w * x1
    const cy1 = h * y1
    ctx.bezierCurveTo(cx0, inverted ? h - cy0 : cy0, cx1, inverted ? h - cy1 : cy1, w, inverted ? h : 0)
    ctx.fill()
  }

  _reset(props) {
    this._onResize()
  }
}

export const SectionDivider = sizeMe({ monitorWidth: true, monitorHeight: true })(SectionDividerImpl)
