import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Paper, TabPane } from 'components'
import { ProjectAPICallsAnalytics } from 'components/charts'

import styles from './styles.module.css'

@observer
export class AnalyticsTabPane extends Component {
  render() {
    const { project } = this.props

    return (
      <TabPane>
        <Paper className={styles.content}>
          <ProjectAPICallsAnalytics project={project} />
        </Paper>
      </TabPane>
    )
  }
}
