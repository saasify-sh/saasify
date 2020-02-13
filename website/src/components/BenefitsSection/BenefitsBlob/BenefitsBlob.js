import React, { Component } from 'react'
import { MorphReplace } from 'react-svg-morph'
import random from 'random'

import { theme } from 'react-saasify'

import styles from './styles.module.css'

export class BenefitsBlob extends Component {
  state = {
    path: ''
  }

  componentDidMount() {
    this._reset()
  }

  render() {
    const { className, title, footer, arrow, fill, items, ...rest } = this.props
    const { path } = this.state

    return (
      <div
        className={theme(styles, 'container', className)}
        {...rest}
        onClick={this._reset}
      >
        {path && (
          <div className={theme(styles, 'body')}>
            <div className={theme(styles, 'blob')}>
              <MorphReplace
                preserveAspectRatio='none'
                viewBox='0 0 100 100'
                fill={fill}
                rotation='none'
                duration={150}
              >
                <svg
                  key={path}
                  viewBox='0 0 100 100'
                  xmlns='http://www.w3.org/2000/svg'
                  preserveAspectRatio='none'
                >
                  <path d={path} />
                </svg>
              </MorphReplace>
            </div>

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
        )}

        <div className={theme(styles, 'footer')}>
          <img src={arrow} />

          {footer}
        </div>
      </div>
    )
  }

  _reset = () => {
    const path = []

    // construct the control points for a blob shape that covers most of
    // the bounding box of its container
    path.push({ x: random.float(46, 54), y: random.float(0, 3) })
    path.push({ x: random.float(5, 10), y: random.float(0, 10) })
    path.push({ x: random.float(0, 5), y: random.float(30, 60) })
    path.push({ x: random.float(0, 10), y: random.float(90, 100) })
    path.push({ x: random.float(40, 60), y: random.float(95, 100) })
    path.push({ x: random.float(90, 100), y: random.float(90, 100) })
    path.push({ x: random.float(90, 100), y: random.float(30, 60) })
    path.push({ x: random.float(90, 100), y: random.float(0, 10) })
    path.push({ x: path[0].x, y: path[0].y })
    path.push({ x: path[1].x, y: path[1].y })

    // catmull rom spline
    let d = ''
    path.forEach((coord, index, array) => {
      const p = []
      if (index === 0) {
        d += `M${coord.x},${coord.y} `

        p.push(array[array.length - 3])
        p.push(array[index])
        p.push(array[index + 1])
        p.push(array[index + 2])
      } else if (index === array.length - 2) {
        return
        // p.push(array[index - 1])
        // p.push(array[index])
        // p.push(array[index + 1])
        // p.push(array[0])
      } else if (index === array.length - 1) {
        return
        // p.push(array[index - 1])
        // p.push(array[index])
        // p.push(array[0])
        // p.push(array[1])
      } else {
        p.push(array[index - 1])
        p.push(array[index])
        p.push(array[index + 1])
        p.push(array[index + 2])
      }

      const bp = []
      bp.push({ x: p[1].x, y: p[1].y })
      bp.push({
        x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        y: (-p[0].y + 6 * p[1].y + p[2].y) / 6
      })
      bp.push({
        x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
        y: (p[1].y + 6 * p[2].y - p[3].y) / 6
      })
      bp.push({ x: p[2].x, y: p[2].y })
      d +=
        'C' +
        bp[1].x +
        ',' +
        bp[1].y +
        ' ' +
        bp[2].x +
        ',' +
        bp[2].y +
        ' ' +
        bp[3].x +
        ',' +
        bp[3].y +
        ' '
    })

    // d += 'Z'

    this.setState({ path: d })
  }
}
