import { addBunny, tickBunnies } from './bunnies'
import { Bunny, DefaultSprite } from './images'
import { AppType, SimulationType } from './types'
import { noop, randIn, times } from './util'
import { addSnake, tickSnakes } from './snakes'
import bindInput from './input'

const createSimulation = ({
  app = AppType,
  width = 800,
  height = 600,
  input = {
    left: false,
    right: false,
  },
  bunnies = [],
  snakes = [],
} = {}) => ({
  app,
  width,
  height,
  input,
  bunnies,
  snakes,
})

const initializeSimulation = (
  app = AppType,
  simulation = SimulationType,
  callback = noop
) => {
  const unbindInput = bindInput(simulation)
  app.loader.add([DefaultSprite, Bunny]).load(() => {
    const { width, height } = simulation
    times(500, () => {
      const x = randIn(0, width)
      const y = randIn(0, height)
      const speed = randIn(-0.025, 0.025)
      const scale = { x: randIn(0.25, 2), y: randIn(0.25, 2) }
      addBunny({ simulation, x, y, speed, scale })
    })
    addSnake({ simulation, x: width / 2, y: height / 2 })
    callback()
  })
  return () => {
    unbindInput()
  }
}

const tickSimulation = (simulation = SimulationType) => (delta = 1) => {
  tickSnakes(simulation, delta)
  tickBunnies(simulation, delta)
}

const defaultSimulation = createSimulation()

export {
  createSimulation,
  defaultSimulation,
  initializeSimulation,
  tickSimulation,
}
