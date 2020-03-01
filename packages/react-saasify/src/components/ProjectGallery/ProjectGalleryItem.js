import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import cs from 'classnames'

import { Paper } from '../Paper'

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
      <Paper className={cs(styles.project, className)} {...rest}>
        {model.id}
      </Paper>
    )
  }
}
