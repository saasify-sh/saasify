import ReactGA from 'react-ga'
import { bootstrap, AuthManager, ThemeManager } from 'react-saasify'
import theme from './theme'

ReactGA.initialize(process.env.REACT_APP_GA)

bootstrap()

AuthManager.context = {
  hostname: window.location.hostname
}

ThemeManager.registerTheme('clean', theme)
ThemeManager.setTheme('clean')
