import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Avatar, Steps } from 'antd'
import { observer, inject } from 'mobx-react'

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

  render() {
    const {
      auth
    } = this.props

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
                current={1}
              >
                <Step title='Create account' description='' />
                <Step title='Call public API' description='Test out the the publicly rate-limited version of the API without an authentication token.' />
                <Step title='Subscribe' description='' />
                <Step title='Call private API' description='' />
              </Steps>
            </div>
          </Section>
        )}
      </FinContext.Consumer>
    )
  }
}
