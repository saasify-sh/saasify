import React, { Component } from 'react'
import { API, EventEmitter, theme } from 'react-saasify'
import { withRouter } from 'react-router'
import { withTracker } from 'lib/with-tracker'
import { observer } from 'mobx-react'
import { observable, computed } from 'mobx'
import { Route, Switch } from 'react-router-dom'

import { NavHeader, NavFooter, ScrollToTopOnMount, Section } from 'components'

import { TabBar } from './TabBar'
import { TabPane } from './TabPane'
import { EventsTabPane } from './EventsTabPane'

import styles from './styles.module.css'

@withTracker
@withRouter
@observer
export class ProjectAdminPage extends Component {
  @observable
  _project = null

  @observable
  _loading = true

  @observable
  _error = false

  @computed get _name() {
    if (this._project) {
      const { lastPublishedDeployment } = this._project

      if (lastPublishedDeployment?.saas?.name) {
        return lastPublishedDeployment?.saas?.name
      }

      return this._project.name
    }

    return 'Project'
  }

  get _projectId() {
    const { namespace, projectName } = this.props.match.params
    return `${namespace}/${projectName}`
  }

  componentDidMount() {
    this._reset()
  }

  render() {
    const { match } = this.props

    const tabs = [
      {
        key: 'overview',
        label: 'Overview',
        to: match.url,
        icon: { type: 'home' }
      },
      {
        key: 'events',
        label: 'Events',
        to: `${match.url}/events`,
        icon: { type: 'schedule' }
      },
      {
        key: 'analytics',
        label: 'Analytics',
        to: `${match.url}/analytics`,
        icon: { type: 'dashboard' }
      },
      {
        key: 'customers',
        label: 'Customers',
        to: `${match.url}/customers`,
        icon: { type: 'user' }
      },
      {
        key: 'settings',
        label: 'Settings',
        to: `${match.url}/settings`,
        icon: { type: 'setting' }
      }
    ]

    return (
      <div className={theme(styles, 'project-admin-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section
          id='project-admin'
          title={this._name}
          className={theme(styles, 'body')}
          contentClassName={theme(styles, 'content')}
        >
          <TabBar tabs={tabs} />

          <Switch>
            <Route path={`${match.path}/events`} exact>
              <EventsTabPane project={this._project} />
            </Route>

            <Route>
              <TabPane>
                <div>{JSON.stringify(this.props.match.params, null, 2)}</div>
              </TabPane>
            </Route>
          </Switch>
        </Section>

        <NavFooter />
      </div>
    )
  }

  async _reset() {
    const projectId = this._projectId

    if (EventEmitter.project && EventEmitter.project.id === projectId) {
      this._project = EventEmitter.project
      EventEmitter.project = null

      this._loading = false
      this._error = false
    }

    this._project = null
    this._loading = true
    this._error = false

    try {
      const project = await API.getProject(projectId, {
        populate: 'lastPublishedDeployment'
      })
      console.log('project', project)

      this._project = project
      this._loading = false
    } catch (err) {
      console.error(err)

      this._error = true
      this._loading = false
    }
  }
}
