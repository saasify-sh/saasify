import { autorun, observable, toJS, trace } from 'mobx'

import deployment from '../lib/deployment'

// TODO: dynamically import themes to reduce bundle size
// (low priority until / unless we have a lot more themes)
import * as themes from '../themes'

const DEFAULT_THEME = 'okta'

class ThemeManager {
  @observable
  theme

  constructor() {
    this.setTheme(deployment.project.saas.theme)
  }

  setTheme = (opts) => {
    const { name = DEFAULT_THEME } = opts

    const themeFactory = themes[name]
    this.theme = themeFactory(opts)
  }
}

const themeManager = observable(new ThemeManager())
window.themeManager = themeManager

if (process.env.NODE_ENV === 'development') {
  autorun(() => {
    trace()
    console.log('theme', toJS(themeManager.theme))

    // window.less.modifyVars(themeManager.theme)
  }, {
    name: 'Theme change'
  })
}

export default themeManager
