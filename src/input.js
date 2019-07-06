import { BUTTONS, SimType } from './types'
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
  '-': 'buttonL',
  _: 'buttonL',
  '=': 'buttonR',
  '+': 'buttonR',
}

const unbound = { up: noop, down: noop }

const getBindings = (sim = SimType) => {
  const {
    input: { keyboard },
  } = sim
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
    buttonL: toggle('buttonL'),
    buttonR: toggle('buttonR'),
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
    buttonL: unbound,
    buttonR: unbound,
  },
  key = ''
) => {
  const query = key.length === 1 ? key.toUpperCase() : key
  return bindings[KEYS[query]] || unbound
}

const getListeners = (sim = SimType) => {
  const bindings = getBindings(sim)
  const listener = action => ({ key }) => {
    const binding = getBinding(bindings, key)
    binding[action]()
  }
  return {
    keydown: listener('down'),
    keyup: listener('up'),
  }
}

const bindKeyboard = (sim = SimType) => {
  const { keyup, keydown } = getListeners(sim)
  window.addEventListener('keydown', keydown)
  window.addEventListener('keyup', keyup)
  return () => {
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
  }
}

const tickGamepad = (sim = SimType) => {
  const { input } = sim
  const [gamepad] = navigator.getGamepads()
  if (!gamepad) return
  const {
    axes: [axisX, axisY],
    buttons,
  } = gamepad
  /*
   0 1 2 3  4  5  6  7  8  9 10 11 12 13 14 15 16
   A B X Y LB RB LT RT BA ST LS RS DU DD DL DR GU
  */
  const [
    buttonA,
    buttonB,
    buttonX,
    buttonY,
    buttonL,
    buttonR,
    ,
    ,
    ,
    ,
    ,
    ,
    dPadUp,
    dPadDown,
    dPadLeft,
    dPadRight,
  ] = buttons.map(b => b.pressed)
  input.gamepad.up = axisY < -DEAD_ZONE || dPadUp
  input.gamepad.down = axisY > DEAD_ZONE || dPadDown
  input.gamepad.left = axisX < -DEAD_ZONE || dPadLeft
  input.gamepad.right = axisX > DEAD_ZONE || dPadRight
  input.gamepad.buttonA = buttonA
  input.gamepad.buttonB = buttonB
  input.gamepad.buttonX = buttonX
  input.gamepad.buttonY = buttonY
  input.gamepad.buttonL = buttonL
  input.gamepad.buttonR = buttonR
}

const tick = (sim = SimType) => {
  tickGamepad(sim)
  const {
    input,
    input: { gamepad, keyboard },
  } = sim
  BUTTONS.forEach(button => {
    input[button] = gamepad[button] || keyboard[button]
  })
}

export { bindKeyboard, tick }
