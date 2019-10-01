import { autorun, observable, toJS, trace } from 'mobx'

// TODO: dynamically import themes to reduce bundle size
// (low priority until / unless we have a lot more themes)
import * as themes from '../themes'

const DEFAULT_THEME = 'okta'

class ThemeManagerClass {
  @observable
  theme = { }

  setTheme = (opts) => {
    const { name = DEFAULT_THEME } = opts

    const themeFactory = themes[name]
    this.theme = themeFactory(opts)
  }
}

export const ThemeManager = observable(new ThemeManagerClass())
window.ThemeManager = ThemeManager

if (process.env.NODE_ENV === 'development') {
  autorun(() => {
    trace()
    console.log('theme', toJS(ThemeManager.theme))

    // window.less.modifyVars(ThemeManager.theme)
  }, {
    name: 'Theme change (development)'
  })
}

export default ThemeManager
