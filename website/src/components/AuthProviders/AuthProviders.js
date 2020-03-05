import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import { Button, authGitHub, authGoogle, authStripe } from 'react-saasify'
import cs from 'classnames'

import styles from './styles.module.css'

@inject('auth')
@withRouter
@observer
export class AuthProviders extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    authConfig: PropTypes.object,
    authParams: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    authConfig: {},
    authParams: {}
  }

  render() {
    const {
      className,
      authConfig,
      authParams,
      auth,
      location,
      staticContext,
      ...rest
    } = this.props

    const hasGitHubAuth = authConfig.github?.enabled !== false
    const hasGoogleAuth = authConfig.google?.enabled !== false
    const hasStripeAuth = authConfig.stripe?.enabled !== false

    const isGitHubLinked = auth.user.providers.github?.id
    const isGoogleLinked = auth.user.providers.google?.id
    const isStripeLinked = auth.user.providers.stripe?.id

    console.log(auth.user)

    return (
      <div className={cs(styles.authProviders, className)} {...rest}>
        {hasGitHubAuth && (
          <div className={styles.authProvider}>
            <h4>GitHub</h4>

            <Button
              className={styles.authButton}
              icon='github'
              onClick={this._onClickGitHub}
              disabled={isGitHubLinked}
            >
              Link GitHub
            </Button>

            {authConfig.github?.google}
          </div>
        )}

        {hasGoogleAuth && (
          <div className={styles.authProvider}>
            <h4>Google</h4>

            <Button
              className={styles.authButton}
              icon='google'
              onClick={this._onClickGoogle}
              disabled={isGoogleLinked}
            >
              Link Google
            </Button>

            {authConfig.stripe?.google}
          </div>
        )}

        {hasStripeAuth && (
          <div className={styles.authProvider}>
            <h4>Stripe</h4>

            <Button
              className={styles.authButton}
              type={authConfig.stripe?.type || 'secondary'}
              onClick={this._onClickStripe}
            >
              {isStripeLinked
                ? 'Re-link Stripe Account'
                : 'Link Stripe Account'}
            </Button>

            {authConfig.stripe?.detail}
          </div>
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
    authStripe(
      { location: this.props.location, auth: this.props.auth },
      this.props.authParams
    )
  }
}
