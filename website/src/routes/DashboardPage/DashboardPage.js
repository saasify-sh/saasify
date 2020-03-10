import React, { Component } from 'react'
import { EventEmitter, theme } from 'react-saasify'
import { withRouter } from 'react-router'
import { withTracker } from 'lib/with-tracker'
import { observer } from 'mobx-react'

import {
  NavHeader,
  NavFooter,
  ScrollToTopOnMount,
  Section,
  ProjectGallery
} from 'components'

import styles from './styles.module.css'

// TODO: once the webapp supports makers and consumers, this dashboard
// will need to link to both dashboards separately

@withTracker
@withRouter
@observer
export class DashboardPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'dashboard-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section
          id='dashboard'
          title='Projects'
          className={theme(styles, 'body')}
          contentClassName={theme(styles, 'content')}
        >
          <ProjectGallery
            className={styles.projectGallery}
            onEditProject={this._onEditProject}
          />
        </Section>

        <NavFooter />
      </div>
    )
  }

  _onEditProject = (model) => {
    EventEmitter.project = model
    this.props.history.push(`/maker/projects/${model.id}`)
  }
}
