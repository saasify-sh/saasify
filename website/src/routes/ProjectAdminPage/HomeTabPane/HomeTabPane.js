import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, computed } from 'mobx'

import { API, Button } from 'react-saasify'
import { Paper, TabPane } from 'components'

import styles from './styles.module.css'

@observer
export class HomeTabPane extends Component {
  @observable
  _lastDevDeployment = null

  @observable
  _loading = true

  @observable
  _error = false

  @computed get _name() {
    const { lastPublishedDeployment } = this.props.project

    if (lastPublishedDeployment?.saas?.name) {
      return lastPublishedDeployment?.saas?.name
    }

    return this.props.project.name
  }

  componentDidMount() {
    this._reset()
  }

  render() {
    const { project } = this.props

    const { lastPublishedDeployment } = project

    return (
      <TabPane className={styles.body}>
        <Paper className={styles.content}>
          <h4 className={styles.h4}>{this._name}</h4>

          <div className={styles.externalDeploymentLink}>
            {lastPublishedDeployment ? (
              <Button
                type='primary'
                target='_blank'
                rel='noopener noreferrer'
                href={project.aliasUrl || lastPublishedDeployment.saasUrl}
              >
                Production deployment ({lastPublishedDeployment.id})
              </Button>
            ) : (
              <p>No published deployments</p>
            )}
          </div>

          <div className={styles.externalDeploymentLink}>
            {this._lastDevDeployment ? (
              <Button
                type='secondary'
                target='_blank'
                rel='noopener noreferrer'
                href={this._lastDevDeployment.saasUrl}
              >
                Latest dev deployment ({this._lastDevDeployment.id})
              </Button>
            ) : (
              <p>No recent deployments</p>
            )}
          </div>
        </Paper>
      </TabPane>
    )
  }

  async _reset() {
    const projectId = this.props.project.id
    const deploymentId = `${projectId}@dev`

    this._lastDevDeployment = null
    this._loading = true
    this._error = false

    try {
      const deployment = await API.getDeployment(deploymentId)
      console.log('latest dev deployment', deployment)

      this._lastDevDeployment = deployment
      this._loading = false
    } catch (err) {
      console.error(err)

      this._error = true
      this._loading = false
    }
  }
}
