/**
 * React application entrypoint.
 */

import 'styles/global.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

// import * as serviceWorker from 'lib/service-worker'
// serviceWorker.unregister()

ReactDOM.render(<App />, document.getElementById('root'))
