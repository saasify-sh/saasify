import styles from './okta.module.css'

export const okta = (opts = { }) => {
  // TODO: make more dynamic based on less variables
  return {
    ...styles,
    ...opts
  }
}
