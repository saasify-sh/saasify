/**
 * @class RelativeTimeLabel
 *
 * Component that displays an relative time label which will auto-update.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ms from 'ms'

const ONE_SECOND = 1000 // milliseconds
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

export class RelativeTimeLabel extends PureComponent {
  static propTypes = {
    time: PropTypes.string.isRequired
  }

  componentDidMount() {
    this._refresh()
  }

  componentWillUnmount() {
    this._cancel()
  }

  render() {
    const { time, ...rest } = this.props

    const delta = new Date() - new Date(time)
    let timestamp

    if (delta <= 2000 && delta >= -20000) {
      // time is in the near future
      timestamp = 'just now'
    } else {
      timestamp = `${ms(delta, { long: true })} ago`
    }

    return <span {...rest}>{timestamp}</span>
  }

  _cancel = () => {
    clearTimeout(this._refreshTimeout)
    this._refreshTimeout = null
  }

  _refresh = () => {
    this._cancel()

    const random = Math.random()
    const delta = Math.abs(new Date() - this.props.time)
    let timeout

    // NOTE: slight randomness is introduced in order to naturally stagger the
    // updates which will be more efficient than processing all updates
    // together. we also discretize the updates into coarse buckets based on
    // how large the relative time delta is. this will result in updating less
    // and less frequently as the time delta gets larger.

    // delta < 0 => now
    // delta < 1 min => 10 sec
    // delta < 10 min => 1 min
    // delta < 60 min => 5 min
    // delta < 24 hrs => 1 hour

    if (delta < ONE_MINUTE) {
      timeout = 10 * ONE_SECOND
    } else if (delta < 10 * ONE_MINUTE) {
      timeout = ONE_MINUTE
    } else if (delta < ONE_HOUR) {
      timeout = ONE_MINUTE + random * 5 * ONE_SECOND
    } else if (delta < ONE_DAY) {
      timeout = ONE_HOUR + random * 5 * ONE_MINUTE
    } else {
      timeout = ONE_DAY + random * 10 * ONE_MINUTE
    }

    this._refreshTimeout = setTimeout(this._refresh, timeout)
  }
}
