import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { inject } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import {
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  Input,
  message
} from 'antd'

const FormItem = Form.Item

import authGitHub from 'lib/auth-github'
import debug from 'lib/debug'
import env from 'lib/env'

import styles from './styles.module.css'

@inject('auth')
@withRouter
@Form.create()
export class LoginForm extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    loading: false
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading } = this.state

    return (
      <Form
        className={styles.loginForm}
        onSubmit={this._onSubmit}
      >
        <Button
          className={styles.submit}
          icon='github'
          onClick={this._onClickGitHub}
        >
          Login with GitHub
        </Button>

        <FacebookLogin
          appId={env.facebookAppId}
          autoLoad={false}
          callback={this._onFacebookResponse}
          onFailure={this._onFacebookFailure}
          render={props => (
            <Button
              className={styles.submit}
              icon='facebook'
              onClick={props.onClick}
            >
              Login with Facebook
            </Button>
          )}
        />

        <Divider />

        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email.' }]
          })(
            <Input
              prefix={
                <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              placeholder='Username'
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password.' }]
          })(
            <Input
              prefix={
                <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              type='password'
              placeholder='Password'
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox>Remember me</Checkbox>
          )}

          <Link
            className={styles.forgot}
            to='/forgot-password'
          >
            Forgot password
          </Link>

          <Button
            type='primary'
            htmlType='submit'
            className={styles.submit}
            loading={loading}
          >
            Log in
          </Button>

          Or <Link to='/signup'>register now!</Link>
        </FormItem>
      </Form>
    )
  }

  _onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.setState({ loading: true })
        this.props.auth.signin(data)
          .catch((err) => {
            debug(err)
            message.error('Error authenticating with GitHub')
          })
      }
    })
  }

  _onClickGitHub = (e) => {
    e.preventDefault()
    authGitHub({ location: this.props.location })
  }

  _onFacebookFailure = (err) => {
    debug(err)
    message.error('Error authenticating with Facebook.')
  }

  _onFacebookResponse = (e) => {
    console.log(e)

    this.props.auth.authWithFacebook(e)
      .catch((err) => {
        debug(err)
        message.error('Error authenticating with Facebook.')
      })
  }
}
