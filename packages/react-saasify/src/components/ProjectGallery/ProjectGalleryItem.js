import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { Paper } from '../Paper'

// import styles from './styles.module.css'

@observer
export class ProjectGalleryItem extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onEditProject: PropTypes.func.isRequired
  }

  render() {
    const { model, onEditProject, ...rest } = this.props

    return <Paper {...rest}>{model.id}</Paper>
  }
}
