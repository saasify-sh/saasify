import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { Avatar, Button, Icon, Steps, Tooltip } from 'antd'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

import styles from './styles.module.css'

const { Step } = Steps

@inject('auth')
@observer
export class DashboardSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
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
      auth
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

    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Dashboard'
            {...this.props}
          >
            <div className={styles.body}>
              <div className={styles.header}>
                <Avatar
                  size='large'
                  icon='user'
                  className={styles.avatar}
                />

                <h4>{auth.user.username}</h4>

                <h4>{auth.user.email}</h4>
              </div>

              <Steps
                direction='vertical'
                current={step}
              >
                <Step
                  title='Create account'
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
                  title='Call private API'
                  description={(
                    <span>
                      Call the API with your private auth token. See the <Link to='/docs'>docs</Link> for more info.
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
                      style={{ color: '#fff' }}
                    />
                  ) : (
                    undefined
                  )}
                />
              </Steps>
            </div>
          </Section>
        )}
      </FinContext.Consumer>
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
