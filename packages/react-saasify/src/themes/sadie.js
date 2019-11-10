import styles from './sadie.module.css'

// TODO
// https://colorhunt.co/palette/118331
// https://colorhunt.co/palette/66116
// https://colorhunt.co/palette/42676
// https://colorhunt.co/palette/121977

// https://colorhunt.co/palette/105443

export const sadie = (opts = {}) => {
  return {
    ...styles,
    '@name': 'sadie',
    '@section-fg-color': '#ffe2e2',
    '@section-bg-color': '#f6f6f6',
    // '@primary-color': '#8785a2',
    ...opts,
    fonts: ['Manjari']
  }
}
