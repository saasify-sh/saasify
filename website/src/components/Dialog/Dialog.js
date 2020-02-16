import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Paper, theme } from 'react-saasify'
import { HotKeys } from 'react-hotkeys'
import { observer } from 'mobx-react'

import styles from './styles.module.css'

@observer
export class Dialog extends Component {
  static propTypes = {
    title: PropTypes.node,
    children: PropTypes.node,
    overlay: PropTypes.node,
    actions: PropTypes.arrayOf(PropTypes.node),
    isOpen: PropTypes.bool.isRequired,
    allowTapToClose: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    actionsClassName: PropTypes.string
  }

  static defaultProps = {
    allowTapToClose: true
  }

  render() {
    const {
      title,
      children,
      overlay,
      isOpen,
      allowTapToClose,
      actions,
      onClose,
      className,
      contentClassName,
      titleClassName,
      actionsClassName,
      ...rest
    } = this.props

    if (!isOpen) {
      return null
    }

    return (
      <HotKeys
        className={theme(styles, 'container', className)}
        onClick={() => allowTapToClose && onClose()}
        handlers={{
          generalCloseDialog: () => isOpen && allowTapToClose && onClose()
        }}
      >
        {overlay}

        <Paper
          className={theme(styles, 'content', contentClassName)}
          onClick={(e) => e.stopPropagation()}
          {...rest}
        >
          {title && (
            <h2 className={theme(styles, 'title', titleClassName)}>{title}</h2>
          )}

          {children}

          {actions && (
            <div className={styles.footer}>
              <div className={theme(styles, 'actions', actionsClassName)}>
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className={theme(styles, 'action', actionsClassName)}
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Paper>
      </HotKeys>
    )
  }
}
