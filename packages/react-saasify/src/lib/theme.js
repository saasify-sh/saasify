import { computed, decorate } from 'mobx'
import cs from 'classnames'

import ThemeManager from 'store/ThemeManager'

const themeUtil = (styles, id, ...args) => {
  const { theme } = ThemeManager
  return cs(styles && styles[id], theme[id], ...args)
}

const variables = [
  // custom
  '@name',
  '@section-fg-color',
  '@section-bg-color',

  // common custom styles
  'light',
  'codeTheme',

  // antd
  '@primary-color',
  '@link-color',
  '@success-color',
  '@warning-color',
  '@error-color',
  '@font-size-base',
  '@heading-color',
  '@text-color',
  '@text-color-secondary ',
  '@disabled-color ',
  '@border-radius-base',
  '@border-color-base',
  '@box-shadow-base'
]

for (const v of variables) {
  Object.defineProperty(themeUtil, v, {
    get: () => ThemeManager.theme[v]
  })
}

// make sure these variables are tracked reactively by mobx
decorate(
  themeUtil,
  variables.reduce((acc, k) => {
    acc[k] = computed
    return acc
  }, {})
)

export const theme = themeUtil
export default themeUtil
