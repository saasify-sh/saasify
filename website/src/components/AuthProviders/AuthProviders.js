import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Button, authGitHub, authGoogle, authStripe } from 'react-saasify'
import cs from 'classnames'

import styles from './styles.module.css'

@observer
export class AuthProviders extends Component {
  static propTypes = {
    authConfig: PropTypes.object,
    authParams: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    authConfig: {},
    authParams: {}
  }

  render() {
    const { className, authConfig, authParams, ...rest } = this.props

    const hasGitHubAuth = authConfig.github?.enabled !== false
    const hasGoogleAuth = authConfig.google?.enabled !== false
    const hasStripeAuth = authConfig.stripe?.enabled !== false

    return (
      <div className={cs(styles.authProviders, className)} {...rest}>
        {hasGitHubAuth && (
          <Button
            className={styles.authButton}
            icon='github'
            onClick={this._onClickGitHub}
          >
            Link GitHub
          </Button>
        )}

        {hasGoogleAuth && (
          <Button
            className={styles.authButton}
            icon='google'
            onClick={this._onClickGoogle}
          >
            Link Google
          </Button>
        )}

        {hasStripeAuth && (
          <Button
            className={styles.authButton}
            icon='stripe'
            onClick={this._onClickStripe}
          >
            Link Stripe
          </Button>
        )}
      </div>
    )
  }

  _onClickGitHub = (e) => {
    e.preventDefault()
    authGitHub({ location: this.props.location }, this.props.authParams)
  }

  _onClickGoogle = (e) => {
    e.preventDefault()
    authGoogle({ location: this.props.location }, this.props.authParams)
  }

  _onClickStripe = (e) => {
    e.preventDefault()
    authStripe({ location: this.props.location }, this.props.authParams)
  }
}
