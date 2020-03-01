import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import cs from 'classnames'

import { Paper } from '../../Paper'
import { RelativeTimeLabel } from '../../RelativeTimeLabel'

import styles from './styles.module.css'

@observer
export class ProjectGalleryItem extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onEditProject: PropTypes.func.isRequired
  }

  render() {
    const { model, onEditProject, className, ...rest } = this.props

    return (
      <Paper
        className={cs(styles.project, className)}
        {...rest}
        onClick={onEditProject}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{model.name}</h3>
        </div>

        <div className={styles.footer}>
          <div className={styles.id}>{model.id}</div>

          <div>
            <span>Updated </span>

            <RelativeTimeLabel
              className={styles.timestamp}
              time={model.updatedAt}
            />
          </div>
        </div>
      </Paper>
    )
  }
}
