import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { TabPane } from 'components'
import { ProjectCustomersAnalytics } from 'components/charts'

@observer
export class CustomersTabPane extends Component {
  render() {
    const { project } = this.props

    return (
      <TabPane>
        <ProjectCustomersAnalytics project={project} />
      </TabPane>
    )
  }
}
