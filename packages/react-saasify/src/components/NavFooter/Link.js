import React from 'react'
import theme from 'lib/theme'

import { NavLink } from 'react-router-dom'

import styles from './styles.module.css'

export default ({ children, label, to, href, className, ...rest }) =>
  to ? (
    <NavLink
      to={to}
      className={theme(styles, 'link', className)}
      activeClassName={theme(styles, 'active-link', className)}
      exact
      {...rest}
    >
      {label || children}
    </NavLink>
  ) : (
    <a href={href} className={theme(styles, 'link', className)} {...rest}>
      {label || children}
    </a>
  )
