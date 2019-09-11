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
  message
} from 'lib/antd'

import authGitHub from 'lib/auth-github'
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
    className: PropTypes.string,
    onAuth: PropTypes.func
  }

  static defaultProps = {
    onAuth: () => undefined
  }

  state = {
    loading: false
  }

  render() {
    const { className } = this.props
    const { getFieldDecorator } = this.props.form
    const { loading } = this.state

    return (
      <Form
        className={theme(styles, 'form', className)}
        onSubmit={this._onSubmit}
      >
        <h2 className={theme(styles, 'title')}>
          Login
        </h2>

        <FormItem>
          <Button
            className={theme(styles, 'submit')}
            icon='github'
            onClick={this._onClickGitHub}
          >
            Login with GitHub
          </Button>
        </FormItem>

        <Divider />

        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please enter your username or email.' }]
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
            rules: [{ required: true, message: 'Please enter your password.' }]
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

          {/* TODO
          <Link
            className={theme(styles, 'forgot')}
            to='/forgot-password'
          >
            Forgot password
          </Link>
          */}
        </FormItem>

        <Button
          type='primary'
          htmlType='submit'
          className={theme(styles, 'submit')}
          loading={loading}
        >
          Log in
        </Button>

        Or <Link to='/signup'>sign up!</Link>
      </Form>
    )
  }

  _onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.setState({ loading: true })
        this.props.auth.signin(data)
          .then(this.props.onAuth)
          .catch((err) => {
            this.setState({ loading: false })
            debug(err)
            message.error(`Error logging in: ${err.response.data.error}`)
          })
      }
    })
  }

  _onClickGitHub = (e) => {
    e.preventDefault()
    authGitHub({ location: this.props.location })
  }
}
