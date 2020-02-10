import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import {
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  Input,
  notification
} from 'lib/antd'

import authGitHub from 'lib/auth-github'
import debug from 'lib/debug'

import styles from './styles.module.css'

const FormItem = Form.Item

@inject('auth')
@withRouter
@Form.create()
export class SignupForm extends Component {
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

    const iconUser = <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
    const iconLock = <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />

    return (
      <Form
        className={theme(styles, 'form', theme.light, className)}
        onSubmit={this._onSubmit}
      >
        <h2 className={theme(styles, 'title')}>Sign up</h2>

        <FormItem>
          <Button
            className={theme(styles, 'submit')}
            icon='github'
            onClick={this._onClickGitHub}
          >
            Sign up with GitHub
          </Button>
        </FormItem>

        <Divider>Or</Divider>

        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter your email.' }]
          })(<Input prefix={iconUser} placeholder='Email' />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please enter a username.' }]
          })(<Input prefix={iconUser} placeholder='Username' />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter a password.' }]
          })(
            <Input prefix={iconLock} type='password' placeholder='Password' />
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
          Sign up
        </Button>
      </Form>
    )
  }

  _onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.setState({ loading: true })
        this.props.auth
          .signup(data)
          .then(this.props.onAuth)
          .catch((err) => {
            debug(err)
            this.setState({ loading: false })

            notification.error({
              message: 'Error signing up',
              description: err?.response?.data?.error || err.message,
              duration: 10000
            })
          })
      }
    })
  }

  _onClickGitHub = (e) => {
    e.preventDefault()
    authGitHub({ location: this.props.location })
  }
}
