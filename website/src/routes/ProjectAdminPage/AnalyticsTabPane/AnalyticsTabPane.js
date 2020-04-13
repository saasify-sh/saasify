import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { TabPane } from 'components'
import { ProjectAPICallsAnalytics } from 'components/charts'

@observer
export class AnalyticsTabPane extends Component {
  render() {
    const { project } = this.props

    return (
      <TabPane>
        <ProjectAPICallsAnalytics project={project} />
      </TabPane>
    )
  }
}
