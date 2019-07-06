import React from 'react'
import ReactDOM from 'react-dom'
import { name } from '../package.json'
import App from './components/App'

const ID = 'root'

const rootElement =
  document.querySelector(`#${ID}`) ||
  (() => {
    const root = document.createElement('div')
    root.id = ID
    return root
  })()

if (rootElement.parentNode !== document.body)
  document.body.appendChild(rootElement)

document.title = name
ReactDOM.render(<App />, rootElement)
