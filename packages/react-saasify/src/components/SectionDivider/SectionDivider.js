import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import Colr from 'colr'
import raf from 'raf'
import random from 'random'
import sizeMe from 'react-sizeme'

import { autorun } from 'mobx'
import { observer } from 'mobx-react'

const isServer = typeof window === 'undefined'

const V = 0.025

@sizeMe({ monitorWidth: true, monitorHeight: true })
@observer
export class SectionDivider extends Component {
  static propTypes = {
    inverted: PropTypes.bool,
    animated: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }

  static defaultProps = {
    inverted: false,
    animated: false,
    style: {}
  }

  _state = {
    dx0: random.float(-V, V),
    dy0: random.float(-V, V),
    dx1: random.float(-V, V),
    dy1: random.float(-V, V),
    x0: random.float(0.0, 0.4),
    y0: random.float(0.2, 1.0),
    x1: random.float(0.4, 1.0),
    y1: random.float(0.5, 1.0),
    ltr: random.boolean()
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

    this._disposer()
  }

  render() {
    const { inverted, animated, style, className, ...rest } = this.props

    return (
      <div
        style={{
          width: '100%',
          height: 64,
          ...style
        }}
        className={theme(null, 'section-divider', className)}
        {...rest}
        ref={this._containerRef}
      >
        <canvas
          ref={this._canvasRef}
          style={{
            width: '100%',
            height: '101%'
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
    let { dx0, dy0, dx1, dy1, x0, y0, x1, y1 } = this._state

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

  // ensure that the canvas is redrawn when the theme changes
  _disposer = autorun(() => this._draw())

  _draw() {
    const { inverted } = this.props

    const { x0, y0, x1, y1, ltr } = this._state

    const foreground = theme['@section-fg-color']
    const background = theme['@section-bg-color']

    if (!this._canvas) {
      return
    }

    const fg = Colr.fromHex(foreground).toRgbArray()
    const foregroundLight = `rgba(${fg[0]}, ${fg[1]}, ${fg[2]}, 0.5)`

    const ctx = this._canvas.getContext('2d')
    const w = this._canvas.width
    const h = this._canvas.height

    ctx.fillStyle = background
    ctx.fillRect(0, 0, w, h)

    if (ltr) {
      ctx.fillStyle = foregroundLight
      ctx.beginPath()
      ctx.moveTo(0, inverted ? h : 0)
      const cx0 = w * x0
      const cy0 = h * y0
      const cx1 = w * x1
      const cy1 = h * y1
      ctx.bezierCurveTo(
        cx0,
        inverted ? h - cy0 : cy0,
        cx1,
        inverted ? h - cy1 : cy1,
        w,
        h / 2
      )
      ctx.lineTo(w, inverted ? h : 0)
      ctx.fill()
    } else {
      ctx.fillStyle = foregroundLight
      ctx.beginPath()
      ctx.moveTo(w, inverted ? h : 0)
      const cx0 = w * x0
      const cy0 = h * y0
      const cx1 = w * x1
      const cy1 = h * y1
      ctx.bezierCurveTo(
        cx1,
        inverted ? h - cy0 : cy0,
        cx0,
        inverted ? h - cy1 : cy1,
        0,
        h / 2
      )
      ctx.lineTo(0, inverted ? h : 0)
      ctx.fill()
    }

    ctx.fillStyle = foreground
    ctx.beginPath()
    ctx.moveTo(0, inverted ? h : 0)
    const cx0 = w * x0
    const cy0 = h * y0
    const cx1 = w * x1
    const cy1 = h * y1
    ctx.bezierCurveTo(
      cx0,
      inverted ? h - cy0 : cy0,
      cx1,
      inverted ? h - cy1 : cy1,
      w,
      inverted ? h : 0
    )
    ctx.fill()
  }

  _reset(props) {
    this._onResize()
  }
}
