import React from 'react'
import theme from 'lib/theme'

import { Link } from 'react-router-dom'

import styles from './styles.module.css'

export default ({ children, label, to, href, className, ...rest }) =>
  to ? (
    <Link to={to} className={theme(styles, 'link', className)} {...rest}>
      {label || children}
    </Link>
  ) : (
    <a href={href} className={theme(styles, 'link', className)} {...rest}>
      {label || children}
    </a>
  )
