import { SimulationType } from './types'
import { noop } from './util'

const KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
}

const toggle = (node = {}, prop = 'toggle') => ({
  /* eslint-disable no-param-reassign */
  down: () => (node[prop] = true),
  up: () => (node[prop] = false),
})

const getBindings = (simulation = SimulationType) => ({
  up: toggle(simulation.input, 'up'),
  down: toggle(simulation.input, 'down'),
  left: toggle(simulation.input, 'left'),
  right: toggle(simulation.input, 'right'),
})

const getListeners = (simulation = SimulationType) => {
  const bindings = getBindings(simulation)
  const unbound = { up: noop, down: noop }
  return {
    keydown: ({ key }) => {
      ;(bindings[KEYS[key]] || unbound).down()
    },
    keyup: ({ key }) => {
      ;(bindings[KEYS[key]] || unbound).up()
    },
  }
}

const bindInput = (simulation = SimulationType) => {
  const { keyup, keydown } = getListeners(simulation)
  window.addEventListener('keydown', keydown)
  window.addEventListener('keyup', keyup)
  return () => {
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
  }
}

export default bindInput
