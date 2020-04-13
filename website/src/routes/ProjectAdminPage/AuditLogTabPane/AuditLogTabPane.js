import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Paper, TabPane } from 'components'

import styles from './styles.module.css'

@observer
export class AuditLogTabPane extends Component {
  render() {
    // const { project } = this.props

    return (
      <TabPane className={styles.body}>
        <Paper className={styles.content}>TODO</Paper>
      </TabPane>
    )
  }
}
