import styles from './theme-clean.module.css'

export default (opts = {}) => {
  return {
    ...styles,
    '@name': 'clean',
    '@section-bg': false,
    '@section-fg-color': '#f9f9fc',
    '@section-bg-color': '#fff',
    ...opts
  }
}
