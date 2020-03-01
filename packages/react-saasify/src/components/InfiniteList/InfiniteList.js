/**
 * @class InfiniteList
 *
 * Component for displaying an infinite list of items based off of ReactLiveQuery.
 *
 * Note that the scrolling internals are largely based off of react-virtualized.
 * @see [react-virtualized]{https://bvaughn.github.io/react-virtualized/}
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import raf from 'raf'
import { observer } from 'mobx-react'

import { EventEmitter } from '../../store/EventEmitter'
import { LayoutCentered } from '../LayoutCentered'
import { LoadingIndicator } from '../LoadingIndicator'

import styles from './styles.module.css'

@observer
export class InfiniteList extends Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    renderItem: PropTypes.func.isRequired,
    renderEmpty: PropTypes.func,
    pagingThresholdPercentage: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    footer: PropTypes.object
  }

  static defaultProps = {
    pagingThresholdPercentage: 0.01,
    renderEmpty: () => 'No results'
  }

  state = {
    windowHeight: window.innerHeight
  }

  componentDidMount() {
    EventEmitter.on('refresh', this._refresh)
    window.addEventListener('resize', this.onComponentResize)
  }

  componentWillUnmount() {
    EventEmitter.removeListener('refresh', this._refresh)

    if (this._disablePointerEventsHandle) {
      clearTimeout(this._disablePointerEventsHandle)
    }

    if (this._loadMoreHandle) {
      raf.cancel(this._loadMoreHandle)
    }

    window.removeEventListener('resize', this.onComponentResize)
  }

  onComponentResize = () => {
    if (window.innerHeight !== this.state.windowHeight) {
      this.setState({
        windowHeight: window.innerHeight
      })
    }
  }

  render() {
    const {
      query,
      footer,
      renderItem,
      renderEmpty,
      pagingThresholdPercentage,
      className,
      style,
      ...rest
    } = this.props

    if (query.status === 'error') {
      return (
        <LayoutCentered {...rest}>
          Error loading results. Please refresh the page or contact support.
        </LayoutCentered>
      )
    }

    const content = query.results.length
      ? query.results.map((item, index, array) => {
          return renderItem(item, index, array)
        })
      : renderEmpty && renderEmpty()

    if (query.isLoadingInitialResults) {
      return <LoadingIndicator dark={false} {...rest} />
    } else {
      return (
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
          {...rest}
        >
          <div
            ref='scrollNode'
            className={styles.scrollNode}
            onScroll={this._onScroll}
          >
            <div className={className} style={style}>
              {content}
            </div>
          </div>

          {footer}

          <div className={styles.loadingSection}>
            {query.isLoading && (
              <div className={styles.refresh}>Loading...</div>
            )}
          </div>
        </div>
      )
    }
  }

  _getNode() {
    return this.refs.scrollNode && ReactDOM.findDOMNode(this.refs.scrollNode)
  }

  _onScroll = (event) => {
    const { query, pagingThresholdPercentage } = this.props

    if (query.isLoading || query.status === 'complete') {
      return
    }

    const node = event.target

    const scrollNode = this._getNode()
    if (node !== scrollNode) {
      return
    }

    if (
      node.scrollTop + node.clientHeight >=
      node.scrollHeight - node.clientHeight * pagingThresholdPercentage
    ) {
      this._loadMore()
    }
  }

  /**
   * This is used to debounce multiple loads in a small span of time.
   *
   * It helps performance for bursty events (like onScroll).
   */
  _loadMore() {
    if (this._loadMoreHandle) {
      return
    }

    this._loadMoreHandle = raf(() => {
      this._loadMoreHandle = null
      this.props.query.load()
    })
  }

  _refresh = () => {
    this.props.query.refresh()
  }
}
