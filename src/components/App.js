import { CssBaseline } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { PRODUCTION } from '../../env'
import Sim from './Sim'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      />
      <style>
        {`
          canvas {
            image-rendering: pixelated;
          }
        `}
      </style>
      <Sim />
    </MuiThemeProvider>
  )
}
export default (PRODUCTION ? App : hot(App))
