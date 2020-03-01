import React, { Component } from 'react'
import { API, EventEmitter, theme } from 'react-saasify'
import { withRouter } from 'react-router'
import { withTracker } from 'lib/with-tracker'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import { NavHeader, NavFooter, ScrollToTopOnMount, Section } from 'components'

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

  componentDidMount() {
    this._reset()
  }

  render() {
    return (
      <div className={theme(styles, 'project-admin-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section
          id='project-admin'
          title='Project Admin Page'
          className={theme(styles, 'body')}
          contentClassName={theme(styles, 'content')}
        >
          <div>{JSON.stringify(this.props.match.params, null, 2)}</div>

          <div>{JSON.stringify(this._project, null, 2)}</div>
        </Section>

        <NavFooter />
      </div>
    )
  }

  async _reset() {
    const { namespace, projectName } = this.props.match.params
    const projectId = `${namespace}/${projectName}`

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
