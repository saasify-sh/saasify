import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Avatar } from 'antd'
import { observer, inject } from 'mobx-react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

import styles from './styles.module.css'

@inject('auth')
@observer
export class DashboardSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const {
      auth,
      ...rest
    } = this.props

    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Dashboard'
            {...rest}
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
            </div>
          </Section>
        )}
      </FinContext.Consumer>
    )
  }
}
