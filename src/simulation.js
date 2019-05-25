import { addBunny, tickBunnies } from './bunnies'
import { Bunny } from './images'
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
  app.loader.add(Bunny).load(() => {
    times(50, () => {
      const x = randIn(0, simulation.width)
      const y = randIn(0, simulation.height)
      const speed = randIn(-0.025, 0.025)
      addBunny({ simulation, x, y, speed })
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
