import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import cs from 'classnames'

import { Button } from 'lib/antd'

import {
  authGitHub,
  authGoogle,
  authSpotify,
  authTwitter,
  authStripe
} from 'lib/oauth'

import stripeIcon from './images/stripe.svg'
import spotifyIcon from './images/spotify.svg'

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
    const hasSpotifyAuth = authConfig.spotify?.enabled !== false
    const hasTwitterAuth = authConfig.twitter?.enabled !== false
    const hasStripeAuth = authConfig.stripe?.enabled !== false

    const isGitHubLinked = auth.user.providers.github?.id
    const isGoogleLinked = auth.user.providers.google?.id
    const isSpotifyLinked = auth.user.providers.spotify?.id
    const isTwitterLinked = auth.user.providers.twitter?.id
    const isStripeLinked = auth.user.providers.stripe?.id

    console.log('user', toJS(auth.user))

    return (
      <div className={cs(styles.authProviders, className)} {...rest}>
        {hasGitHubAuth && (
          <div className={styles.authProvider}>
            <Button
              className={styles.authButton}
              icon='github'
              type={authConfig.github?.type || 'secondary'}
              onClick={this._onClickGitHub}
            >
              {isGitHubLinked ? 'Re-link GitHub' : 'Link GitHub'}
            </Button>

            {authConfig.github?.detail}
          </div>
        )}

        {hasGoogleAuth && (
          <div className={styles.authProvider}>
            <Button
              className={styles.authButton}
              icon='google'
              type={authConfig.google?.type || 'secondary'}
              onClick={this._onClickGoogle}
            >
              {isGoogleLinked ? 'Re-link Google' : 'Link Google'}
            </Button>

            {authConfig.google?.detail}
          </div>
        )}

        {hasSpotifyAuth && (
          <div className={styles.authProvider}>
            <Button
              className={styles.authButton}
              type={authConfig.spotify?.type || 'secondary'}
              onClick={this._onClickSpotify}
            >
              <img
                className={styles.icon}
                src={spotifyIcon}
                alt='Spotify logo'
              />

              {isSpotifyLinked ? 'Re-link Spotify' : 'Link Spotify'}
            </Button>

            {authConfig.spotify?.detail}
          </div>
        )}

        {hasTwitterAuth && (
          <div className={styles.authProvider}>
            <Button
              className={styles.authButton}
              icon='twitter'
              type={authConfig.twitter?.type || 'secondary'}
              onClick={this._onClickTwitter}
            >
              {isTwitterLinked ? 'Re-link Twitter' : 'Link Twitter'}
            </Button>

            {authConfig.twitter?.detail}
          </div>
        )}

        {hasStripeAuth && (
          <div className={styles.authProvider}>
            <Button
              className={styles.authButton}
              type={authConfig.stripe?.type || 'secondary'}
              onClick={this._onClickStripe}
            >
              <img className={styles.icon} src={stripeIcon} alt='Stripe logo' />

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

  _onClickSpotify = (e) => {
    e.preventDefault()
    authSpotify({ location: this.props.location }, this.props.authParams)
  }

  _onClickTwitter = (e) => {
    e.preventDefault()
    authTwitter({ location: this.props.location }, this.props.authParams)
  }

  _onClickStripe = (e) => {
    e.preventDefault()
    authStripe(
      { location: this.props.location, auth: this.props.auth },
      this.props.authParams
    )
  }
}
