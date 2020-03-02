import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Paper } from 'components'
import { TabPane } from '../TabPane'

import styles from './styles.module.css'

@observer
export class EventsTabPane extends Component {
  render() {
    const { project } = this.props

    return (
      <TabPane>
        <Paper style={styles.content}>
          <div>{JSON.stringify(project, null, 2)}</div>
        </Paper>
      </TabPane>
    )
  }
}
