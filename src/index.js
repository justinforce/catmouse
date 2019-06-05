import React from 'react'
import ReactDOM from 'react-dom'
import { name } from '../package.json'
import App from './components/App'

const rootElement =
  document.querySelector('#root') ||
  (() => {
    const root = document.createElement('div')
    root.id = 'root'
    return root
  })()

if (rootElement.parentNode !== document.body)
  document.body.appendChild(rootElement)

document.title = name
ReactDOM.render(<App />, rootElement)
