import { addBunny, tickBunnies } from './bunnies'
import { Bunny, DefaultSprite } from './images'
import { AppType, SimulationType } from './types'
import { noop, randIn, times } from './util'

const createSimulation = ({
  app = AppType,
  width = 800,
  height = 600,
  bunnies = [],
} = {}) => ({
  app,
  width,
  height,
  bunnies,
})

const initializeSimulation = (
  app = AppType,
  simulation = SimulationType,
  callback = noop
) => {
  app.loader.add([DefaultSprite, Bunny]).load(() => {
    times(500, () => {
      const x = randIn(0, simulation.width)
      const y = randIn(0, simulation.height)
      const speed = randIn(-0.025, 0.025)
      const scale = { x: randIn(0.25, 2), y: randIn(0.25, 2) }
      addBunny({ simulation, x, y, speed, scale })
    })
    callback()
  })
}

const tickSimulation = (simulation = SimulationType) => (delta = 1) => {
  tickBunnies(simulation, delta)
}

const defaultSimulation = createSimulation()

export {
  createSimulation,
  defaultSimulation,
  initializeSimulation,
  tickSimulation,
}
