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

import { observer } from 'mobx-react'
import raf from 'raf'

import { LayoutCentered } from '../LayoutCentered'
import { LoadingIndicator } from '../LoadingIndicator'

import styles from './styles.css'

@observer
export class InfiniteList extends Component {
  static contextTypes = {
    EventEmitter: PropTypes.object.isRequired
  }

  static propTypes = {
    query: PropTypes.object.isRequired,

    itemRenderer: PropTypes.func.isRequired,

    emptyRenderer: PropTypes.func,

    displayBottomUpwards: PropTypes.bool,

    pagingThresholdPercentage: PropTypes.number,

    contentContainerClassName: PropTypes.string,

    contentContainerStyle: PropTypes.object,

    footer: PropTypes.object
  }

  static defaultProps = {
    displayBottomUpwards: false,
    pagingThresholdPercentage: 0.01,
    emptyRenderer: () => 'No search results'
  }

  state = {
    windowHeight: window.innerHeight
  }

  componentDidMount() {
    this.context.EventEmitter.on('refresh', this._refresh)
    this._attachedToBottom = !!this.props.displayBottomUpwards
    window.addEventListener('resize', this.onComponentResize)
  }

  componentWillUnmount() {
    this.context.EventEmitter.removeListener('refresh', this._refresh)

    if (this._disablePointerEventsHandle) {
      clearTimeout(this._disablePointerEventsHandle)
    }

    if (this._loadPageHandle) {
      raf.cancel(this._loadPageHandle)
    }

    window.removeEventListener('resize', this.onComponentResize)
  }

  componentWillReceiveProps(props) {
    if (props.query !== this.props.query) {
      this._attachedToBottom = !!props.displayBottomUpwards
    }
  }

  componentWillUpdate() {
    if (
      !this.props.displayBottomUpwards ||
      !this.refs.scrollNode ||
      this._attachedToBottom
    ) {
      return
    }

    const node = this._getNode()
    if (!node) return

    this._attachedToBottom =
      node.scrollTop + node.clientHeight >= node.scrollHeight * 0.97
    this._onDataWillUpdate()
  }

  componentDidUpdate() {
    if (!this.props.displayBottomUpwards) {
      return
    }

    if (this._attachedToBottom) {
      const node = this._getNode()

      if (node) {
        node.scrollTop = node.scrollHeight
        this._attachedToBottom = false
      }
    }

    this._onDataDidUpdate()
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
      displayBottomUpwards,
      itemRenderer,
      emptyRenderer,
      pagingThresholdPercentage,
      contentContainerClassName,
      contentContainerStyle,
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
          return itemRenderer(item, index, array)
        })
      : emptyRenderer && emptyRenderer()

    if (query.isLoadingInitialResults) {
      return <LoadingIndicator dark={false} {...rest} />
    } else {
      const loadingStyle = {}
      const scrollNodeStyles = {}

      if (displayBottomUpwards) {
        scrollNodeStyles.paddingTop = 48
        loadingStyle.top = 16
      } else {
        loadingStyle.bottom = 16
      }

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
            style={scrollNodeStyles}
            onScroll={this._onScroll}
          >
            <div
              className={contentContainerClassName}
              style={contentContainerStyle}
            >
              {content}
            </div>
          </div>

          {footer}

          <div className={styles.loadingSection} style={loadingStyle}>
            {query.isLoading && (
              <div className={styles.refresh}>Loading...</div>
            )}
          </div>
        </div>
      )
    }
  }

  _onDataWillUpdate() {
    if (!this.props.displayBottomUpwards) return

    const node = this._getNode()
    if (!node) return

    this._scrollHeight = node.scrollHeight
  }

  _onDataDidUpdate() {
    if (!this.props.displayBottomUpwards) return

    const node = this._getNode()
    if (!node) return

    if (node.scrollHeight > this._scrollHeight) {
      const scrollTop =
        node.scrollTop + (node.scrollHeight - this._scrollHeight)
      node.scrollTop = Math.max(
        0,
        Math.min(node.scrollHeight - node.clientHeight, scrollTop)
      )
    }
  }

  _getNode() {
    return this.refs.scrollNode && ReactDOM.findDOMNode(this.refs.scrollNode)
  }

  _onScroll = (event) => {
    const {
      query,
      displayBottomUpwards,
      pagingThresholdPercentage
    } = this.props

    if (query.isLoading || query.status === 'complete') {
      return
    }

    const node = event.target

    const scrollNode = this._getNode()
    if (node !== scrollNode) {
      return
    }

    if (displayBottomUpwards) {
      if (node.scrollTop <= node.clientHeight * pagingThresholdPercentage) {
        this._loadPage()
      }
    } else {
      if (
        node.scrollTop + node.clientHeight >=
        node.scrollHeight - node.clientHeight * pagingThresholdPercentage
      ) {
        this._loadPage()
      }
    }
  }

  /**
   * Use this method to debounce multiple loads in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  _loadPage() {
    if (this._loadPageHandle) {
      return
    }

    this._loadPageHandle = raf(() => {
      this._loadPageHandle = null
      this.props.query.load()
    })
  }

  _refresh = () => {
    this.props.query.refresh()
  }
}
