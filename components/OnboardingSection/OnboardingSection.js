import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { Button, Icon, Result, Steps, Tooltip } from 'antd'
import { observer, inject } from 'mobx-react'
import { withRouter, Link } from 'react-router-dom'

import { Section } from '../Section'
import { Paper } from '../Paper'

import styles from './styles.module.css'

const { Step } = Steps

@withRouter
@inject('auth')
@observer
export class OnboardingSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    isTokenVisible: false,
    copiedTextToClipboard: false
  }

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const {
      auth,
      location,
      className,
      ...rest
    } = this.props

    const {
      isTokenVisible,
      copiedTextToClipboard
    } = this.state

    let step = 0

    if (auth.isAuthenticated) {
      step = 1

      if (auth.consumer && auth.consumer.enabled) {
        step = 2

        if (auth.consumer.activated) {
          step = 3
        }
      }
    }

    const params = new URLSearchParams(location.search)
    const success = params.get('success')
    let result = null

    if (auth.consumer && auth.consumer.enabled) {
      if (success) {
        result = (
          <Result
            status='success'
            title='Your subscription is ready to use!'
            subTitle='Just add your auth token to your API requests to remove the public rate limits.'
            className={styles.result}
          />
        )
      }
    } else {
      result = (
        <Result
          status='info'
          title='Subscribe to remove rate limits'
          subTitle={(
            <span>
              Once you're ready, <Link to='/checkout?plan=unlimited'>subscribe</Link> to remove the public rate limits.
            </span>
          )}
          extra={(
            <>
              <Button
                type='primary'
                key='subscribe'
                href='/checkout?plan=unlimited'
              >
                Subscribe
              </Button>

              <Button
                type='secondary'
                key='pricing'
                href='/pricing'
              >
                View Pricing
              </Button>

              <Button
                type='secondary'
                key='docs'
                href='/docs'
              >
                View Docs
              </Button>
            </>
          )}
          className={styles.result}
        />
      )
    }

    return (
      <Section
        title='Onboarding'
        {...rest}
      >
        <Paper className={styles.body}>
          {result}

          <Steps
            direction='vertical'
            current={step}
            className={styles.steps}
          >
            <Step
              title='Create Account'
              description='Test out the the public, rate-limited version of the API without an auth token.'
            />

            <Step
              title='Subscribe'
              description={(
                <span>
                  Subscribe to the <Link to='/checkout?plan=unlimited'>unlimited plan</Link> in order to remove the public rate limits.
                </span>
              )}
            />

            <Step
              title='Call Private API'
              description={(
                <span>
                  Call the API with your private auth token (below). See the <Link to='/docs'>docs</Link> for more info.
                  {auth.consumer && (
                    <>
                      <br />

                      <Tooltip
                        placement='top'
                        title={isTokenVisible ? 'Hide auth token' : 'Show auth token'}
                      >
                        <Button
                          icon={isTokenVisible ? 'eye' : 'eye-invisible'}
                          className={styles.tokenButton}
                          onClick={this._onClickTokenVisibility}
                        />
                      </Tooltip>

                      <Tooltip
                        placement='top'
                        title={copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'}
                      >
                        <Button
                          onClick={this._onClickCopyToken}
                        >
                          {isTokenVisible ? (
                            auth.consumer.token
                          ) : (
                            `${auth.consumer.token.substr(0, 8)} ...`
                          )}
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </span>
              )}
              icon={step === 2 ? (
                <Icon
                  type='loading'
                />
              ) : (
                undefined
              )}
            />
          </Steps>
        </Paper>
      </Section>
    )
  }

  _onClickTokenVisibility = () => {
    this.setState({ isTokenVisible: !this.state.isTokenVisible })
  }

  _onClickCopyToken = () => {
    const { token } = this.props.auth.consumer
    copyTextToClipboard(token)

    this.setState({ copiedTextToClipboard: true })
    this._clearCopyTimeout()
    this._copyTimeout = setTimeout(this._onCopyTimeout, 3000)
  }

  _onCopyTimeout = () => {
    this._clearCopyTimeout()
    this.setState({ copiedTextToClipboard: false })
  }

  _clearCopyTimeout = () => {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }
}
