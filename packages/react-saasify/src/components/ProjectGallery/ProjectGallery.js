/**
 * @class ProjectGallery
 *
 * Component for displaying a gallery of Saasify projects.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Empty } from 'lib/antd'
import { InfiniteList } from '../InfiniteList'
import { ProjectGalleryItem } from './ProjectGalleryItem'
import { ProjectGalleryLiveQuery } from './ProjectGalleryLiveQuery'

import styles from './styles.module.css'

export class ProjectGallery extends Component {
  static propTypes = {
    // optional search filter and sorting
    search: PropTypes.any,
    sort: PropTypes.string,

    // optional transforms
    transforms: PropTypes.arrayOf(PropTypes.func),

    // optional optimization for lazy loading
    active: PropTypes.bool,

    className: PropTypes.string,

    onEditProject: PropTypes.func.isRequired
  }

  static defaultProps = {
    search: undefined,
    active: true,
    sort: '-updatedAt',
    transforms: []
  }

  state = {}

  componentDidMount() {
    if (this.props.active) {
      this.state.query.load()
    }
  }

  componentWillUnmount() {
    // tell the query to stop listening for "live" updates
    this.state.query.freeze()
  }

  static getDerivedStateFromProps(props, state) {
    if (
      !state.query ||
      props.search !== state.query.search ||
      props.sort !== state.query.sort
    ) {
      if (state.query) {
        // tell the old query to stop listening for "live" updates
        state.query.freeze()
      }

      const query = new ProjectGalleryLiveQuery({
        search: props.search,
        sort: props.sort,
        transforms: props.transforms
      })

      if (props.active) {
        query.load()
      }

      return { query }
    } else if (props.active && state.query.status !== 'active') {
      state.query.load()
    }
  }

  render() {
    const { search, sort, transforms, active, ...rest } = this.props
    const { query } = this.state

    return (
      <InfiniteList
        query={query}
        renderContent={this._renderContent}
        {...rest}
      />
    )
  }

  _renderContent = (models) => {
    if (models.length) {
      return (
        <div className={styles.projectGallery}>
          {models.map((model) => (
            <ProjectGalleryItem
              key={model.id}
              model={model}
              onEditProject={() => this.props.onEditProject(model)}
            />
          ))}
        </div>
      )
    } else {
      return <Empty />
    }
  }
}
