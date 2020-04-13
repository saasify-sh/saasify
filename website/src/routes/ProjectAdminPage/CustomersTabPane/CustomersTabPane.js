import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Paper, TabPane } from 'components'
import { ProjectCustomersAnalytics } from 'components/charts'

import styles from './styles.module.css'

@observer
export class CustomersTabPane extends Component {
  render() {
    const { project } = this.props

    return (
      <TabPane>
        <Paper className={styles.content}>
          <ProjectCustomersAnalytics project={project} />
        </Paper>
      </TabPane>
    )
  }
}
