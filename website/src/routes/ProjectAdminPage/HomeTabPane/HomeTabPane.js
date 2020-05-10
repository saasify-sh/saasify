import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, computed } from 'mobx'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { API, Button, Divider, Tooltip } from 'react-saasify'
import { TabPane } from 'components'

import styles from './styles.module.css'

@observer
export class HomeTabPane extends Component {
  @observable
  _lastDevDeployment = null

  @observable
  _loading = true

  @observable
  _error = false

  @observable
  _copiedSecretToClipboard = false

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
        <h4 className={styles.h4}>{this._name}</h4>

        <div className={styles.externalDeploymentLink}>
          {lastPublishedDeployment ? (
            <Button
              type='primary'
              target='_blank'
              rel='noopener noreferrer'
              icon='link'
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
              icon='link'
              href={this._lastDevDeployment.saasUrl}
            >
              Latest dev deployment ({this._lastDevDeployment.id})
            </Button>
          ) : (
            <p>No recent deployments</p>
          )}
        </div>

        <Divider />

        {project._secret && (
          <div className={styles.secret}>
            <Tooltip
              placement='top'
              title={
                this._copiedSecretToClipboard ? 'Copied!' : 'Copy to clipboard'
              }
            >
              <Button type='primary' ghost onClick={this._onClickCopySecret}>
                {`x-saasify-secret ${project._secret.substr(0, 8)} ...`}
              </Button>
            </Tooltip>
          </div>
        )}
      </TabPane>
    )
  }

  _onClickCopySecret = () => {
    copyTextToClipboard(this.props.project._secret)

    this._copiedSecretToClipboard = true
    this._clearCopyTimeout()
    this._copyTimeout = setTimeout(this._onCopyTimeout, 3000)
  }

  _onCopyTimeout = () => {
    this._clearCopyTimeout()
    this._copiedSecretToClipboard = false
  }

  _clearCopyTimeout = () => {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
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
