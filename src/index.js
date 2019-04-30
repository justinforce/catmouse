import { CssBaseline } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { PRODUCTION } from '../env'
import App from './components/App'
import { name } from '../package.json'

const rootElement = document.createElement('div')
const RootComponent = PRODUCTION ? App : hot(App)
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

document.title = name
document.body.appendChild(rootElement)

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
    />
    <style>
      {`
        html,
        body,
        body > div {
          height: 100%;
        }
      `}
    </style>
    <RootComponent name={name} />
  </MuiThemeProvider>,
  rootElement
)
