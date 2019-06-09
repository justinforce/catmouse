import { BUTTONS, SimulationType } from './types'
import { noop } from './util'

const DEAD_ZONE = 0.25

const KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
  ' ': 'buttonA',
  Z: 'buttonX',
  X: 'buttonY',
}

const unbound = { up: noop, down: noop }

const getBindings = (simulation = SimulationType) => {
  const {
    input: { keyboard },
  } = simulation
  const toggle = prop => ({
    down: () => (keyboard[prop] = true),
    up: () => (keyboard[prop] = false),
  })
  return {
    up: toggle('up'),
    down: toggle('down'),
    left: toggle('left'),
    right: toggle('right'),
    buttonA: toggle('buttonA'),
    buttonB: toggle('buttonB'),
    buttonX: toggle('buttonX'),
    buttonY: toggle('buttonY'),
  }
}

const getBinding = (
  bindings = {
    up: unbound,
    down: unbound,
    left: unbound,
    right: unbound,
    buttonA: unbound,
    buttonB: unbound,
    buttonX: unbound,
    buttonY: unbound,
  },
  key = ''
) => {
  const query = key.length === 1 ? key.toUpperCase() : key
  return bindings[KEYS[query]] || unbound
}

const getListeners = (simulation = SimulationType) => {
  const bindings = getBindings(simulation)
  const listener = action => ({ key }) => {
    const binding = getBinding(bindings, key)
    binding[action]()
  }
  return {
    keydown: listener('down'),
    keyup: listener('up'),
  }
}

const bindKeyboard = (simulation = SimulationType) => {
  const { keyup, keydown } = getListeners(simulation)
  window.addEventListener('keydown', keydown)
  window.addEventListener('keyup', keyup)
  return () => {
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
  }
}

const tickGamepad = (simulation = SimulationType) => {
  const { input } = simulation
  const [gamepad] = navigator.getGamepads()
  if (!gamepad) return
  const {
    axes: [axisX, axisY],
    buttons,
  } = gamepad
  const [buttonA, buttonB, buttonX, buttonY] = buttons.map(b => b.pressed)
  input.gamepad.up = axisY < -DEAD_ZONE
  input.gamepad.down = axisY > DEAD_ZONE
  input.gamepad.left = axisX < -DEAD_ZONE
  input.gamepad.right = axisX > DEAD_ZONE
  input.gamepad.buttonA = buttonA
  input.gamepad.buttonB = buttonB
  input.gamepad.buttonX = buttonX
  input.gamepad.buttonY = buttonY
}

const tick = (simulation = SimulationType) => {
  tickGamepad(simulation)
  const {
    input,
    input: { gamepad, keyboard },
  } = simulation
  BUTTONS.forEach(button => {
    input[button] = gamepad[button] || keyboard[button]
  })
}

export { bindKeyboard, tick as tickInput }
