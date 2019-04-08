import React from 'react'
import PropTypes from 'prop-types'

export class SignupButton extends React.Component {
  static propTypes = {
    todo: PropTypes.string.isRequired
  }

  render() {
    const {
      todo
    } = this.props

    return (
      <div>
        {todo}
      </div>
    )
  }
}
