import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Button, Form, Icon, Input, notification, theme } from 'react-saasify'

import { Dialog } from '../Dialog'

import styles from './styles.module.css'

@inject('auth')
@Form.create()
@observer
export class SignupDialog extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  state = {
    loading: false,
    submitted: false,
    duplicate: false
  }

  render() {
    const { isOpen, onClose } = this.props
    const { getFieldDecorator } = this.props.form
    const { loading, submitted, duplicate } = this.state

    const actions = submitted
      ? [
          <Button key='close' onClick={onClose}>
            Close
          </Button>
        ]
      : [
          <Button key='cancel' onClick={onClose}>
            Cancel
          </Button>,

          <Button
            key='submit'
            type='primary'
            htmlType='submit'
            loading={loading}
            onClick={this._onSubmit}
          >
            Request Access
          </Button>
        ]

    const iconMail = <Icon type='mail' className={styles.icon} />
    const iconUser = <Icon type='user' className={styles.icon} />

    let body

    if (submitted) {
      if (duplicate) {
        body = (
          <div>
            <p>Hello again 👋</p>

            <p>You've requested access before - welcome back!</p>

            <p>
              Please <a href='mailto:support@saasify.sh'>drop us a note</a> or
              search your inbox for next steps. 😊
            </p>

            <p>Thanks!</p>
          </div>
        )
      } else {
        body = (
          <div>
            <p>Welcome 😊</p>

            <p>
              We'll be in touch soon -- really excited to help you get your SaaS
              ideas off the ground!
            </p>

            <p>Thanks!</p>

            {/*
            <p>
              Let's get started with a quick survey to see where you're at in
              the process...
            </p>
            */}
          </div>
        )
      }
    } else {
      body = (
        <Form
          className={theme(styles, 'form', theme.light)}
          onSubmit={this._onSubmit}
        >
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please enter your name.' }]
            })(
              <Input
                prefix={iconUser}
                placeholder='Full Name'
                onPressEnter={this._onSubmit}
              />
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please enter your email address.'
                }
              ]
            })(
              <Input
                prefix={iconMail}
                placeholder='Email'
                onPressEnter={this._onSubmit}
              />
            )}
          </Form.Item>
        </Form>
      )
    }
    return (
      <Dialog
        isOpen={isOpen}
        title='Request Early Access'
        onClose={onClose}
        actions={actions}
        contentClassName={styles.body}
      >
        {body}
      </Dialog>
    )
  }

  _onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.setState({ loading: true })
      }

      this.props.auth
        .signupForBeta(data)
        .then((res) => {
          console.log(res)
          this.setState({ loading: false, submitted: true })
        })
        .catch((err) => {
          console.error(err)
          this.setState({ loading: false })

          if (err?.response?.status === 409) {
            this.setState({ submitted: true, duplicate: true })
          } else {
            notification.error({
              message: 'Error submitting form',
              description: err?.response?.data?.error || err.message,
              duration: 7
            })
          }
        })
    })
  }
}
