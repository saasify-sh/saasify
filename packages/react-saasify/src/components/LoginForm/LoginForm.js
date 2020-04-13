import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { inject } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'

import {
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  Input,
  notification
} from 'lib/antd'

import { authGitHub, authGoogle, authTwitter } from 'lib/oauth'
import debug from 'lib/debug'

import styles from './styles.module.css'

const FormItem = Form.Item

@inject('auth')
@withRouter
@Form.create()
export class LoginForm extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    authConfig: PropTypes.object,
    authParams: PropTypes.object,
    className: PropTypes.string,
    onAuth: PropTypes.func
  }

  static defaultProps = {
    authConfig: {},
    authParams: {},
    onAuth: () => undefined
  }

  state = {
    loading: false
  }

  render() {
    const { className, authConfig } = this.props
    const { getFieldDecorator } = this.props.form
    const { loading } = this.state

    const iconUser = <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
    const iconLock = <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />

    const hasGitHubAuth = authConfig.github?.enabled !== false
    const hasGoogleAuth = authConfig.google?.enabled !== false
    const hasTwitterAuth = authConfig.twitter?.enabled !== false
    const hasDefaultAuth = authConfig.default?.enabled !== false

    return (
      <Form
        className={theme(styles, 'form', theme.light, className)}
        onSubmit={this._onSubmit}
      >
        <h2 className={theme(styles, 'title')}>Login</h2>

        {authConfig.preBody}

        {hasGitHubAuth && (
          <FormItem>
            <Button
              className={theme(styles, 'submit')}
              icon='github'
              onClick={this._onClickGitHub}
            >
              Log in with GitHub
            </Button>
          </FormItem>
        )}

        {hasGoogleAuth && (
          <FormItem>
            <Button
              className={theme(styles, 'submit')}
              icon='google'
              onClick={this._onClickGoogle}
            >
              Log in with Google
            </Button>
          </FormItem>
        )}

        {hasTwitterAuth && (
          <FormItem>
            <Button
              className={theme(styles, 'submit')}
              icon='twitter'
              onClick={this._onClickTwitter}
            >
              Log in with Twitter
            </Button>
          </FormItem>
        )}

        {(hasGitHubAuth || hasGoogleAuth || hasTwitterAuth) &&
          hasDefaultAuth && <Divider>Or</Divider>}

        {hasDefaultAuth && (
          <React.Fragment>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your username or email.'
                  }
                ]
              })(<Input prefix={iconUser} placeholder='Username' />)}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please enter your password.' }
                ]
              })(
                <Input
                  prefix={iconLock}
                  type='password'
                  placeholder='Password'
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
            </FormItem>

            <Button
              type='primary'
              htmlType='submit'
              className={theme(styles, 'submit')}
              loading={loading}
            >
              Log in
            </Button>
          </React.Fragment>
        )}

        {authConfig.orSignup !== false && (
          <div className={theme(styles, 'or-signup')}>
            {authConfig.orSignup || (
              <span>
                Or <Link to='/signup'>sign up!</Link>
              </span>
            )}
          </div>
        )}

        {authConfig.postBody}
      </Form>
    )
  }

  _onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.setState({ loading: true })
        this.props.auth
          .signin(data)
          .then(this.props.onAuth)
          .catch((err) => {
            debug(err)
            this.setState({ loading: false })

            notification.error({
              message: 'Error logging in',
              description: err?.response?.data?.error || err.message,
              duration: 10
            })
          })
      }
    })
  }

  _onClickGitHub = (e) => {
    e.preventDefault()
    authGitHub({ location: this.props.location }, this.props.authParams)
  }

  _onClickGoogle = (e) => {
    e.preventDefault()
    authGoogle({ location: this.props.location }, this.props.authParams)
  }

  _onClickTwitter = (e) => {
    e.preventDefault()
    authTwitter({ location: this.props.location }, this.props.authParams)
  }
}
