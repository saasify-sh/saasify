import styles from './theme.module.css'

export default (opts = {}) => {
  return {
    ...styles,
    '@name': 'clean',
    '@section-fg-color': '#f9f9fc',
    '@section-bg-color': '#fff',
    ...opts
  }
}
